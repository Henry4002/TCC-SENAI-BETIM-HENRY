// ==========================================================================
// CONFIGURAÇÃO DA API (Conexão Real com o Back-End)
// ==========================================================================
const API_URL = "https://projeto-tcc-senai-production.up.railway.app"; // Substitua pela sua URL real do Railway se necessário

const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
if (usuarioLogado && usuarioLogado.nome) {
    // Altere o ID abaixo para o ID que o seu elemento HTML "Leandro" utiliza no header
    const elementoNome = document.querySelector(".header .usuario-nome") || document.getElementById("nomeUsuario");
    if (elementoNome) {
        elementoNome.innerText = usuarioLogado.nome; // Vai mudar dinamicamente para "AdministradorInicial"!
    }
}

const TesteService = {
    listarTestes: async () => {
        const response = await fetch(`${API_URL}/teste`);
        if (!response.ok) throw new Error("Erro ao buscar testes do servidor");
        return await response.json();
    },
    criarTeste: async (dataTeste, resultado, idUsuario, idVersaoReceita) => {
        // Envia estruturado de acordo com o @ManyToOne da Model Java
        const payload = {
            dataTeste: dataTeste ? `${dataTeste}T00:00:00` : new Date().toISOString(),
            resultado: resultado,
            usuario: { id: idUsuario },
            versaoReceita: { id: idVersaoReceita }
        };

        const response = await fetch(`${API_URL}/teste`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("Erro ao salvar novo teste");
        return await response.json();
    },
    editarTeste: async (idTeste, dataTeste, resultado, idUsuario, idVersaoReceita) => {
        const payload = {
            id: parseInt(idTeste),
            dataTeste: dataTeste.includes("T") ? dataTeste : `${dataTeste}T00:00:00`,
            resultado: resultado,
            usuario: { id: idUsuario },
            versaoReceita: { id: idVersaoReceita }
        };

        const response = await fetch(`${API_URL}/teste/${idTeste}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("Erro ao atualizar teste");
        return await response.json();
    },
    removerTeste: async (idTeste) => {
        const response = await fetch(`${API_URL}/teste/${idTeste}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error("Erro ao excluir teste");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    renderizarTabelaTestes();
    inicializarModalTeste();
    configurarFormularioTeste();
});

// ==========================================================================
// RENDERIZAR TABELA REFEITA COM DTO DO JAVA
// ==========================================================================
async function renderizarTabelaTestes() {
    const tbody = document.getElementById("tabelaTestesBody");
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#555; padding:30px;">Carregando testes...</td></tr>`;

    try {
        // Puxa a lista direto do banco de dados via DTO
        const testes = await TesteService.listarTestes();

        tbody.innerHTML = "";

        if (testes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#999; padding:30px;">Nenhum teste registrado.</td></tr>`;
            return;
        }

        testes.forEach(teste => {
            // Trata a data vinda do LocalDateTime do Java
            let dataFormatada = "N/A";
            let dataParaInput = "";
            if (teste.dataTeste) {
                const parteData = teste.dataTeste.split('T')[0]; // Pega YYYY-MM-DD
                dataParaInput = parteData;
                const [ano, mes, dia] = parteData.split('-');
                dataFormatada = `${dia}/${mes}/${ano}`;
            }

            const resultadoLimpo = teste.resultado ? teste.resultado.replace(/'/g, "\\'").replace(/"/g, "&quot;") : "";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <div style="font-size: 0.85rem; color: #555; margin-bottom: 2px;">Data</div>
                    <div style="color: #2D1A11; font-weight: 500;">${dataFormatada}</div>
                </td>
                <td>
                    <div style="font-size: 0.85rem; color: #555; margin-bottom: 2px;">Receita</div>
                    <div style="color: #2D1A11; font-weight: 500;">${teste.receita || "Não informada"}</div>
                </td>
                <td>
                    <div style="font-size: 0.85rem; color: #555; margin-bottom: 2px;">Versão</div>
                    <div style="color: #2D1A11; font-weight: 500;">Versão ${teste.numeroVersao || "N/A"}</div>
                </td>
                <td>
                    <div style="font-size: 0.85rem; color: #555; margin-bottom: 2px;">Responsável</div>
                    <div style="color: #2D1A11; font-weight: 500;">${teste.usuario || "Leandro"}</div>
                </td>
                <td>
                    <div style="font-size: 0.85rem; color: #555; margin-bottom: 2px;">Resultado</div>
                    <div style="color: #2D1A11; font-weight: 500;">${teste.resultado || "-"}</div>
                </td>
                <td style="text-align: center; width: 140px;">
                    <div style="display: flex; gap: 15px; justify-content: center; align-items: center;">
                        <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;" 
                             onclick="abrirEdicaoTeste(${teste.id}, '${dataParaInput}', '${resultadoLimpo}')">
                            <div style="background-color: #DE9E52; color: #fff; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 4px;">
                                <i class="fa-solid fa-pencil"></i>
                            </div>
                            <span style="font-size: 0.75rem; color: #555;">Editar</span>
                        </div>
                        
                        <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;" onclick="executarExclusaoTeste(${teste.id})">
                            <div style="background-color: #C82333; color: #fff; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 4px;">
                                <i class="fa-solid fa-trash-can"></i>
                            </div>
                            <span style="font-size: 0.75rem; color: #555;">Excluir</span>
                        </div>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#c93b3b; padding:30px;">Não foi possível carregar a tabela de testes remota.</td></tr>`;
    }
}

// ==========================================================================
// INTERAÇÕES E MODAL
// ==========================================================================
window.executarExclusaoTeste = async function(idTeste) {
    if (confirm("Deseja realmente remover permanentemente este registro de teste do sistema?")) {
        try {
            await TesteService.removerTeste(idTeste);
            renderizarTabelaTestes();
        } catch (err) {
            alert(err.message);
        }
    }
}

window.abrirEdicaoTeste = async function(idTeste, data, resultado) {
    document.getElementById("modalTesteTitulo").textContent = "Editar Resultado de Teste";
    document.getElementById("editIndexTeste").value = idTeste;
    document.getElementById("testeData").value = data;
    document.getElementById("testeResultado").value = resultado;

    try {
        // Carrega receitas do back-end para preencher o select principal
        const responseReceitas = await fetch(`${API_URL}/receita`);
        const receitas = await responseReceitas.json();
        
        const selectReceita = document.getElementById("testeReceita");
        selectReceita.innerHTML = '<option value="" disabled selected>Selecione a receita...</option>';
        receitas.forEach(r => selectReceita.innerHTML += `<option value="${r.id}">${r.nome}</option>`);

        // Deixa a seleção da versão aberta para o usuário escolher a nova se desejar alterar
        const selectVersao = document.getElementById("testeVersao");
        selectVersao.innerHTML = '<option value="" disabled selected>Selecione a versão testada...</option>';
        selectVersao.disabled = false;
        selectVersao.style.backgroundColor = "#fff";

        document.getElementById("modalTeste").style.display = "flex";
    } catch (err) {
        alert("Erro ao abrir componentes de edição de receita.");
    }
}

async function inicializarModalTeste() {
    const modal = document.getElementById("modalTeste");
    const selectReceita = document.getElementById("testeReceita");
    const selectVersao = document.getElementById("testeVersao");

    document.getElementById("btnNovoTeste").addEventListener("click", async () => {
        document.getElementById("formTeste").reset();
        document.getElementById("editIndexTeste").value = "";
        document.getElementById("modalTesteTitulo").textContent = "Registrar Resultado de Teste";
        
        selectVersao.innerHTML = '<option value="" disabled selected>Selecione primeiro a receita</option>';
        selectVersao.disabled = true;
        selectVersao.style.backgroundColor = "#eee";
        document.getElementById("testeData").value = new Date().toISOString().split('T')[0];

        try {
            const response = await fetch(`${API_URL}/receita`);
            const receitas = await response.json();
            selectReceita.innerHTML = '<option value="" disabled selected>Selecione a receita...</option>';
            receitas.forEach(r => selectReceita.innerHTML += `<option value="${r.id}">${r.nome}</option>`);
            modal.style.display = "flex";
        } catch (err) {
            alert("Erro ao buscar receitas no servidor.");
        }
    });

    document.getElementById("btnFecharModalTeste").addEventListener("click", () => modal.style.display = "none");

    // Evento dinâmico de busca de versões ao alterar a receita selecionada
    selectReceita.addEventListener("change", async (e) => {
        selectVersao.innerHTML = '<option value="" disabled selected>Buscando versões...</option>';
        
        try {
            const response = await fetch(`${API_URL}/versaoreceita/receita/${e.target.value}`); // Alinhe esse endpoint com o seu VersaoReceitaController se necessário
            const versoes = await response.json();
            
            selectVersao.innerHTML = '<option value="" disabled selected>Selecione a versão...</option>';
            if (versoes.length === 0) {
                selectVersao.innerHTML = '<option value="" disabled selected>Nenhuma versão cadastrada</option>';
                selectVersao.disabled = true;
                selectVersao.style.backgroundColor = "#eee";
            } else {
                versoes.forEach(v => selectVersao.innerHTML += `<option value="${v.id}">Versão ${v.numeroVersao || v.numero_versao}</option>`);
                selectVersao.disabled = false;
                selectVersao.style.backgroundColor = "#fff";
            }
        } catch (err) {
            selectVersao.innerHTML = '<option value="" disabled selected>Erro ao carregar versões</option>';
        }
    });
}

function configurarFormularioTeste() {
    document.getElementById("formTeste").addEventListener("submit", async (e) => {
        e.preventDefault();
        const idEdit = document.getElementById("editIndexTeste").value;
        const idVersao = parseInt(document.getElementById("testeVersao").value);
        const dataTeste = document.getElementById("testeData").value;
        const resultado = document.getElementById("testeResultado").value.trim();

        if (isNaN(idVersao)) {
            alert("Por favor, selecione uma versão válida da receita.");
            return;
        }

        // Definimos o ID 8 como padrão inicial de segurança (caso o localStorage falhe)
        let idUsuarioFinal = 8; 

        try {
            // CORRIGIDO: Buscando a chave exata definida no seu login.js ("usuario")
            const usuarioString = localStorage.getItem("usuario");
            
            if (usuarioString) {
                const usuarioObjeto = JSON.parse(usuarioString);
                if (usuarioObjeto && usuarioObjeto.id) {
                    idUsuarioFinal = usuarioObjeto.id; // Pega o ID dinâmico do Administrador (8) ou de quem logar!
                }
            }
        } catch (error) {
            console.log("Erro ao ler o localStorage do usuário, usando ID padrão 8:", error);
        }

        try {
            // Envia o ID dinâmico e correto para a API
            if (idEdit === "") {
                await TesteService.criarTeste(dataTeste, resultado, idUsuarioFinal, idVersao);
            } else {
                await TesteService.editarTeste(idEdit, dataTeste, resultado, idUsuarioFinal, idVersao);
            }
            document.getElementById("modalTeste").style.display = "none";
            renderizarTabelaTestes();
        } catch (err) {
            alert("Erro de Restrição: " + err.message);
        }
    });
}