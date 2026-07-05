const API_URL = "https://projeto-tcc-senai-production.up.railway.app";

const ReceitaService = {
    // 1. Listar Receitas
    listarReceitas: async () => {
        const res = await fetch(`${API_URL}/receita`);
        if (!res.ok) throw new Error("Erro ao buscar receitas no servidor.");
        return await res.json();
    },

    // Listar Produtos
    listarProdutos: async () => {
        const res = await fetch(`${API_URL}/produtos`);
        if (!res.ok) throw new Error("Erro ao carregar produtos.");
        return await res.json();
    },

    // 2. Criar Nova Receita
    criarReceita: async (nome, idProduto) => {
        const idUsuario = obterIdUsuarioLogado();

        const payload = {
            nome: nome,
            usuario: { id: idUsuario },
            produto: idProduto ? { id: parseInt(idProduto) } : null
        };

        const res = await fetch(`${API_URL}/receita`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Erro ao salvar nova receita.");
        return await res.json();
    },

    // 3. Listar Versões (Seu GET retorna uma lista de VersaoReceitaDTO)
    listarVersoesPorReceita: async (idReceita) => {
        const res = await fetch(`${API_URL}/versaoreceita`);
        if (!res.ok) throw new Error("Erro ao buscar versões.");
        const todasVersoesDTO = await res.json();
        
        // No DTO o nome do campo que criamos ou filtramos pode ser resolvido buscando todas
        // Como o DTO traz a receita, vamos buscar e filtrar pelo nome ou se houver id.
        // Como o DTO de VersaoReceita retorna 'receita' como String (nome), vamos buscar por lá de forma preventiva
        return todasVersoesDTO;
    },

    // 4. Criar Nova Versão (Ajustado para bater 100% com a sua Model Java)
    criarVersao: async (numeroVersao, descricao, idReceita, idStatus) => {
        const numeroLimpo = parseInt(numeroVersao.toString().replace(/[^0-9]/g, '')) || 1;

        // Payload formatado de forma limpa apenas com os IDs necessários para as entidades @ManyToOne
        const payload = {
            numeroVersao: numeroLimpo,
            descricao: descricao,
            receita: { 
                id: parseInt(idReceita) 
            },
            statusVersaoReceita: { 
                id: parseInt(idStatus) 
            }
        };

        const res = await fetch(`${API_URL}/versaoreceita`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const erroTxt = await res.text();
            console.error("Resposta de erro do servidor:", erroTxt);
            throw new Error("Erro ao salvar nova versão.");
        }
        return await res.json();
    },

    // 5. Remover Receita
    removerReceita: async (id) => {
        const res = await fetch(`${API_URL}/receita/${id}`, {
            method: "DELETE"
        });
        if (!res.ok) throw new Error("Erro ao remover a receita.");
    }
};

function obterIdUsuarioLogado() {
    try {
        const dadosLocais = localStorage.getItem("usuario") || localStorage.getItem("Usuario");
        if (dadosLocais) {
            const user = JSON.parse(dadosLocais);
            if (user && user.id) return user.id;
        }
    } catch (err) {
        console.warn(err);
    }
    return 1;
}

document.addEventListener("DOMContentLoaded", () => {
    renderizarTabelaReceitas().catch(e => console.error("Erro ao listar:", e));
    inicializarModaisReceita();
    configurarFormularioReceita();
    configurarBuscaReceitas();
    carregarNomeUsuarioLogado();
});

function configurarBuscaReceitas() {
    const inputBusca = document.getElementById("buscaReceita");
    if (inputBusca) {
        // Remove ouvintes antigos clonando o elemento se necessário, ou usando input simples limpo
        inputBusca.removeAttribute('oninput'); 
        
        inputBusca.addEventListener("input", (e) => {
            const termo = e.target.value;
            renderizarTabelaReceitas(termo);
        });
    }
}

async function renderizarTabelaReceitas(filtro = "") {
    const tbody = document.getElementById("tabelaReceitasBody");
    if (!tbody) return;
    
    // Força a limpeza absoluta limpando todos os nós filhos para não acumular em loop
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    try {
        const receitas = await ReceitaService.listarReceitas();
        
        // Se a API não trouxer nada
        if (!receitas || receitas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:40px; color:#555;">Nenhuma receita registrada ainda.</td></tr>`;
            return;
        }

        // Filtra os dados localmente de forma segura antes de montar a tabela
        const receitasFiltradas = receitas.filter(rec => {
            if (!filtro) return true;
            return rec.nome && rec.nome.toLowerCase().includes(filtro.toLowerCase().trim());
        });

        if (receitasFiltradas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:30px; color:#555;">Nenhuma receita encontrada na busca.</td></tr>`;
            return;
        }

        // Monta as linhas na tabela
        receitasFiltradas.forEach(rec => {
            // Tratativa para o "Produto não vinculado": tenta ler do objeto populado pelo JPA
            let nomeProduto = "Produto não vinculado";
            
            if (rec.produto) {
                if (typeof rec.produto === 'string') {
                    nomeProduto = rec.produto;
                } else if (rec.produto.nome) {
                    nomeProduto = rec.produto.nome;
                }
            } else if (rec.nomeProduto) {
                nomeProduto = rec.nomeProduto;
            }

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="color: #331E11; font-weight: bold; font-size: 1.05rem; padding: 12px 10px;">${rec.nome}</td>
                <td style="color: #555; font-weight: 500; padding: 12px 10px;">
                    <i class="fa-solid fa-box" style="color: #DE9E52; margin-right: 6px;"></i> ${nomeProduto}
                </td>
                <td style="text-align: center; width: 140px; padding: 12px 10px;">
                    <div class="grupo-acoes">
                        <button class="btn-acao editar" title="Gerir Versões" onclick="abrirModalVersoes(${rec.id}, '${rec.nome.replace(/'/g, "\\'")}')" style="cursor:pointer; background:none; border:none; margin-right:12px;">
                            <i class="fa-solid fa-code-branch" style="color: #DE9E52; font-size: 1.1rem;"></i>
                        </button>
                        <button class="btn-acao excluir" title="Excluir Receita" onclick="removerReceita(${rec.id})" style="cursor:pointer; background:none; border:none;">
                            <i class="fa-solid fa-trash" style="color: #c93b3b; font-size: 1.1rem;"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (e) {
        console.error("Erro ao renderizar receitas:", e);
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:40px; color:#c93b3b; font-weight:bold;">Erro ao conectar com o servidor de receitas.</td></tr>`;
    }
}

function inicializarModaisReceita() {
    const modalRec = document.getElementById("modalReceita");
    const modalVersoes = document.getElementById("modalVersoes");
    
    const btnNovo = document.getElementById("btnNovoReceita");
    if (btnNovo && modalRec) {
        btnNovo.addEventListener("click", async () => {
            const form = document.getElementById("formReceita");
            if (form) form.reset();
            
            const editIndex = document.getElementById("editIndexRec");
            if (editIndex) editIndex.value = "";
            
            await carregarProdutosSelect(); 
            modalRec.classList.add("ativo");
        });
    }

    const btnFecharRec = document.getElementById("btnFecharModalRec");
    if (btnFecharRec && modalRec) {
        btnFecharRec.addEventListener("click", () => modalRec.classList.remove("ativo"));
    }

    const btnFecharVersoes = document.getElementById("btnFecharModalVersoes");
    if (btnFecharVersoes && modalVersoes) {
        btnFecharVersoes.addEventListener("click", () => modalVersoes.classList.remove("ativo"));
    }
}

async function carregarProdutosSelect() {
    const select = document.getElementById("recProduto");
    if (!select) return;
    
    select.innerHTML = '<option value="" disabled selected>Selecione o produto base...</option>';
    
    try {
        const produtos = await ReceitaService.listarProdutos();
        produtos.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = p.nome;
            select.appendChild(opt);
        });
    } catch (error) {
        console.error("Não foi possível carregar os produtos para o select:", error);
    }
}

function configurarFormularioReceita() {
    const formRec = document.getElementById("formReceita");
    if (formRec) {
        formRec.addEventListener("submit", async (e) => {
            e.preventDefault();
            const inputNome = document.getElementById("recNome");
            const inputProduto = document.getElementById("recProduto");
            
            if (!inputNome || !inputProduto) return;

            try {
                await ReceitaService.criarReceita(inputNome.value, inputProduto.value);
                const modalRec = document.getElementById("modalReceita");
                if (modalRec) modalRec.classList.remove("ativo");
                await renderizarTabelaReceitas();
            } catch (error) {
                alert("Erro ao salvar receita: " + error.message);
            }
        });
    }
    
    const formVersao = document.getElementById("formVersao");
    if (formVersao) {
        formVersao.addEventListener("submit", async (e) => {
            e.preventDefault();
            const idReceita = document.getElementById("vIdReceita")?.value;
            const numero = document.getElementById("vNumero")?.value;
            const status = document.getElementById("vStatus")?.value;
            const desc = document.getElementById("vDescricao")?.value;

            if (!idReceita) return;

            try {
                await ReceitaService.criarVersao(numero, desc, idReceita, status);
                formVersao.reset();
                if (document.getElementById("vIdReceita")) {
                    document.getElementById("vIdReceita").value = idReceita; 
                }
                await renderizarTabelaVersoes(idReceita, nomeReceitaGlobal);
            } catch (error) {
                alert("Erro ao criar versão: " + error.message);
            }
        });
    }
}

let nomeReceitaGlobal = ""; // Auxiliar para manter o controle nas atualizações internas

window.abrirModalVersoes = async function(idReceita, nomeReceita) {
    nomeReceitaGlobal = nomeReceita;
    const titulo = document.getElementById("modalVersoesTitulo");
    if (titulo) titulo.textContent = `Versões: ${nomeReceita}`;
    
    const inputId = document.getElementById("vIdReceita");
    if (inputId) inputId.value = idReceita;
    
    const formVersao = document.getElementById("formVersao");
    if (formVersao) formVersao.reset();
    
    // Oculta ou remove o campo de data se ele existir, pois o Java gera o LocalDate.now() automaticamente
    const inputData = document.getElementById("vData");
    if (inputData) inputData.value = new Date().toISOString().split('T')[0];
    
    await renderizarTabelaVersoes(idReceita, nomeReceita);
    
    const modalVersoes = document.getElementById("modalVersoes");
    if (modalVersoes) modalVersoes.classList.add("ativo");
}

window.removerReceita = async function(id) {
    if(confirm("Deseja realmente excluir esta receita e todas as suas versões?")) {
        try {
            await ReceitaService.removerReceita(id);
            await renderizarTabelaReceitas();
        } catch (error) {
            alert("Erro ao excluir receita: " + error.message);
        }
    }
}

async function renderizarTabelaVersoes(idReceita, nomeReceita) {
    const tbody = document.getElementById("tabelaVersoesBody");
    if (!tbody) return;
    
    tbody.innerHTML = "";

    try {
        const dtoLista = await ReceitaService.listarVersoesPorReceita(idReceita);
        
        // Filtra a lista DTO pelo nome da receita corrente recebido da tabela pai
        const versoesFiltradas = dtoLista.filter(v => v.receita === nomeReceita);

        if (!versoesFiltradas || versoesFiltradas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:15px; color:#888;">Nenhuma versão registrada. Crie a versão inicial acima (Digite apenas números).</td></tr>`;
            return;
        }

        versoesFiltradas.forEach(v => {
            // Formata a data retornada pelo DTO ([ano, mes, dia] ou string YYYY-MM-DD)
            let dataF = "-";
            if (v.dataVersao) {
                if (Array.isArray(v.dataVersao)) {
                    dataF = `${v.dataVersao[2].toString().padStart(2, '0')}/${v.dataVersao[1].toString().padStart(2, '0')}/${v.dataVersao[0]}`;
                } else {
                    dataF = v.dataVersao.split('-').reverse().join('/');
                }
            }

            const statusTxt = v.status || "Ativa";
            let cor = "#198754";
            if(statusTxt.toLowerCase().includes("teste")) cor = "#DE9E52";
            if(statusTxt.toLowerCase().includes("obsoleta")) cor = "#dc3545";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="padding: 12px 10px; font-weight: bold; color: #331E11;">v${v.numeroVersao}</td>
                <td style="padding: 12px 10px;"><span style="color:${cor}; font-weight:bold; background-color: ${cor}15; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">${statusTxt}</span></td>
                <td style="padding: 12px 10px; color:#555;">${v.descricao}</td>
                <td style="padding: 12px 10px; color:#555;">${dataF}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Erro ao listar versões:", error);
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:15px; color:#dc3545; font-weight:bold;">Erro ao carregar versões da API.</td></tr>`;
    }
}

function carregarNomeUsuarioLogado() {
    const spanNome = document.getElementById("nomeUsuario");
    if (!spanNome) return;

    try {
        const dadosLocais = localStorage.getItem("usuario") || localStorage.getItem("Usuario");
        if (dadosLocais) {
            const user = JSON.parse(dadosLocais);
            if (user && user.nome) {
                spanNome.textContent = user.nome; // Injeta o nome do usuário vindo do banco/login
                return;
            }
        }
    } catch (err) {
        console.warn("Erro ao ler nome do usuário do localStorage:", err);
    }
    spanNome.textContent = "Usuário"; // Nome padrão caso não ache no localStorage
}
