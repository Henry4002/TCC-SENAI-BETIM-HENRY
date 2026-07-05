// ==========================================================================
// SERVIÇO DE TESTES (Mock Back-end)
// ==========================================================================
const TesteService = {
    listarTestes: async () => JSON.parse(localStorage.getItem('testes_producao')) || [],
    criarTeste: async (dataTeste, resultado, idUsuario, idVersaoReceita) => {
        const testes = await TesteService.listarTestes();
        const novoTeste = { id: Date.now(), data_teste: dataTeste, resultado: resultado, idUsuario: idUsuario, idVersao_receita: idVersaoReceita };
        testes.push(novoTeste);
        localStorage.setItem('testes_producao', JSON.stringify(testes));
    },
    editarTeste: async (idTeste, dataTeste, resultado, idVersaoReceita) => {
        let testes = await TesteService.listarTestes();
        const index = testes.findIndex(t => t.id == idTeste);
        if (index !== -1) {
            testes[index].data_teste = dataTeste;
            testes[index].resultado = resultado;
            testes[index].idVersao_receita = idVersaoReceita;
            localStorage.setItem('testes_producao', JSON.stringify(testes));
        }
    },
    removerTeste: async (idTeste) => {
        let testes = await TesteService.listarTestes();
        localStorage.setItem('testes_producao', JSON.stringify(testes.filter(t => t.id != idTeste)));
    }
};

document.addEventListener("DOMContentLoaded", () => {
    renderizarTabelaTestes();
    inicializarModalTeste();
    configurarFormularioTeste();
});

// ==========================================================================
// RENDERIZAR TABELA ESTILO CARDS (Identico à Imagem)
// ==========================================================================
async function renderizarTabelaTestes() {
    const tbody = document.getElementById("tabelaTestesBody");
    if (!tbody) return;

    tbody.innerHTML = "";
    const testes = await TesteService.listarTestes();
    const receitas = await ReceitaService.listarReceitas();

    if (testes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#999; padding:30px;">Nenhum teste registrado.</td></tr>`;
        return;
    }

    for (const teste of testes) {
        let nomeReceita = "Desconhecida";
        let numeroVersao = "N/A";
        let idReceitaReal = null;
        
        for (const r of receitas) {
            const versoes = await ReceitaService.listarVersoesPorReceita(r.id);
            const versaoEncontrada = versoes.find(v => v.id == teste.idVersao_receita);
            if (versaoEncontrada) {
                nomeReceita = r.nome;
                numeroVersao = versaoEncontrada.numero_versao;
                idReceitaReal = r.id;
                break;
            }
        }

        const [ano, mes, dia] = teste.data_teste.split('-');
        const dataFormatada = `${dia}/${mes}/${ano}`;
        const resultadoLimpo = teste.resultado.replace(/'/g, "\\'").replace(/"/g, "&quot;");

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <div style="font-size: 0.85rem; color: #555; margin-bottom: 2px;">Data</div>
                <div style="color: #2D1A11; font-weight: 500;">${dataFormatada}</div>
            </td>
            <td>
                <div style="font-size: 0.85rem; color: #555; margin-bottom: 2px;">Receita</div>
                <div style="color: #2D1A11; font-weight: 500;">${nomeReceita}</div>
            </td>
            <td>
                <div style="font-size: 0.85rem; color: #555; margin-bottom: 2px;">Versão</div>
                <div style="color: #2D1A11; font-weight: 500;">${numeroVersao}</div>
            </td>
            <td>
                <div style="font-size: 0.85rem; color: #555; margin-bottom: 2px;">Responsável</div>
                <div style="color: #2D1A11; font-weight: 500;">Leandro</div>
            </td>
            <td>
                <div style="font-size: 0.85rem; color: #555; margin-bottom: 2px;">Resultado</div>
                <div style="color: #2D1A11; font-weight: 500;">${teste.resultado}</div>
            </td>
            <td style="text-align: center; width: 140px;">
                <div style="display: flex; gap: 15px; justify-content: center; align-items: center;">
                    <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;" onclick="abrirEdicaoTeste(${teste.id}, ${idReceitaReal}, ${teste.idVersao_receita}, '${teste.data_teste}', '${resultadoLimpo}')">
                        <div style="background-color: #DE9E52; color: #fff; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 4px;">
                            <i class="fa-solid fa-pencil"></i>
                        </div>
                        <span style="font-size: 0.75rem; color: #555;">Editar</span>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;" onclick="removerTeste(${teste.id})">
                        <div style="background-color: #C82333; color: #fff; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 4px;">
                            <i class="fa-solid fa-trash-can"></i>
                        </div>
                        <span style="font-size: 0.75rem; color: #555;">Excluir</span>
                    </div>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    }
}

// ==========================================================================
// FUNÇÕES GLOBAIS DE AÇÃO E MODAL
// ==========================================================================
window.removerTeste = async function(idTeste) {
    if (confirm("Excluir este registro de teste?")) {
        await TesteService.removerTeste(idTeste);
        renderizarTabelaTestes();
    }
}

window.abrirEdicaoTeste = async function(idTeste, idReceita, idVersao, data, resultado) {
    document.getElementById("modalTesteTitulo").textContent = "Editar Resultado de Teste";
    document.getElementById("editIndexTeste").value = idTeste;
    document.getElementById("testeData").value = data;
    document.getElementById("testeResultado").value = resultado;

    const receitas = await ReceitaService.listarReceitas();
    const selectReceita = document.getElementById("testeReceita");
    selectReceita.innerHTML = '<option value="" disabled>Selecione a receita...</option>';
    receitas.forEach(r => selectReceita.innerHTML += `<option value="${r.id}">${r.nome}</option>`);
    selectReceita.value = idReceita;

    const versoes = await ReceitaService.listarVersoesPorReceita(idReceita);
    const selectVersao = document.getElementById("testeVersao");
    selectVersao.innerHTML = '<option value="" disabled>Selecione a versão testada...</option>';
    versoes.forEach(v => selectVersao.innerHTML += `<option value="${v.id}">${v.numero_versao} - ${v.descricao}</option>`);
    
    selectVersao.disabled = false;
    selectVersao.style.backgroundColor = "#fff";
    selectVersao.value = idVersao;

    document.getElementById("modalTeste").style.display = "flex";
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

        const receitas = await ReceitaService.listarReceitas();
        selectReceita.innerHTML = '<option value="" disabled selected>Selecione a receita...</option>';
        receitas.forEach(r => selectReceita.innerHTML += `<option value="${r.id}">${r.nome}</option>`);

        modal.style.display = "flex";
    });

    document.getElementById("btnFecharModalTeste").addEventListener("click", () => modal.style.display = "none");

    selectReceita.addEventListener("change", async (e) => {
        const versoes = await ReceitaService.listarVersoesPorReceita(parseInt(e.target.value));
        selectVersao.innerHTML = '<option value="" disabled selected>Selecione a versão...</option>';
        
        if (versoes.length === 0) {
            selectVersao.innerHTML = '<option value="" disabled selected>Nenhuma versão cadastrada</option>';
            selectVersao.disabled = true;
            selectVersao.style.backgroundColor = "#eee";
        } else {
            versoes.forEach(v => selectVersao.innerHTML += `<option value="${v.id}">${v.numero_versao}</option>`);
            selectVersao.disabled = false;
            selectVersao.style.backgroundColor = "#fff";
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

        if (isNaN(idVersao)) return alert("Selecione uma versão válida.");

        if (idEdit === "") await TesteService.criarTeste(dataTeste, resultado, 1, idVersao);
        else await TesteService.editarTeste(idEdit, dataTeste, resultado, idVersao);
        
        document.getElementById("modalTeste").style.display = "none";
        renderizarTabelaTestes();
    });
}