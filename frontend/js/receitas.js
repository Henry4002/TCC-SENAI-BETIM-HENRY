// ==========================================================================
// CONTROLADOR DA TELA DE RECEITAS
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    renderizarTabelaReceitas();
    inicializarModaisReceita();
    configurarFormularioReceita();
    configurarBuscaReceitas();
});

// ==========================================================================
// 1. BARRA DE BUSCA
// ==========================================================================
function configurarBuscaReceitas() {
    const inputBusca = document.getElementById("buscaReceita");
    if (inputBusca) {
        inputBusca.addEventListener("input", (e) => {
            renderizarTabelaReceitas(e.target.value);
        });
    }
}

// ==========================================================================
// 2. RENDERIZAR A TABELA PRINCIPAL
// ==========================================================================
async function renderizarTabelaReceitas(filtro = "") {
    const tbody = document.getElementById("tabelaReceitasBody");
    if (!tbody) return;
    
    tbody.innerHTML = "";

    try {
        const receitas = await ReceitaService.listarReceitas();
        // Puxa os produtos do banco de dados local para saber a que produto a receita pertence
        const produtos = JSON.parse(localStorage.getItem('produtos_db')) || [];

        if (receitas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:40px; color:#555;">Nenhuma receita registada ainda.</td></tr>`;
            return;
        }

        let encontrou = false;

        receitas.forEach(rec => {
            // Filtro da barra de busca
            if (filtro && !rec.nome.toLowerCase().includes(filtro.toLowerCase())) return;
            encontrou = true;

            // Procura o nome do Produto vinculado a esta receita
            const produtoVinculado = produtos.find(p => p.id == rec.idProduto);
            const nomeProduto = produtoVinculado ? produtoVinculado.nome : "Produto não vinculado";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="color: #331E11; font-weight: bold; font-size: 1.05rem;">${rec.nome}</td>
                <td style="color: #555; font-weight: 500;">
                    <i class="fa-solid fa-box" style="color: #DE9E52; margin-right: 6px;"></i> ${nomeProduto}
                </td>
                <td style="text-align: center; width: 140px;">
                    <div class="grupo-acoes">
                        <button class="btn-acao editar" title="Gerir Versões" onclick="abrirModalVersoes(${rec.id}, '${rec.nome.replace(/'/g, "\\'")}')">
                            <i class="fa-solid fa-code-branch"></i>
                        </button>
                        <button class="btn-acao excluir" title="Excluir Receita" onclick="removerReceita(${rec.id})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        if (!encontrou) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:30px; color:#555;">Nenhuma receita encontrada na busca.</td></tr>`;
        }
    } catch (e) {
        console.error("Erro ao renderizar receitas:", e);
    }
}

// ==========================================================================
// 3. JANELAS MODAIS (ABRIR E FECHAR)
// ==========================================================================
function inicializarModaisReceita() {
    const modalRec = document.getElementById("modalReceita");
    const modalVersoes = document.getElementById("modalVersoes");
    
    // --- Modal Principal: Nova Receita ---
    const btnNovo = document.getElementById("btnNovoReceita");
    if (btnNovo) {
        btnNovo.addEventListener("click", () => {
            document.getElementById("formReceita").reset();
            document.getElementById("editIndexRec").value = "";
            carregarProdutosSelect(); // Preenche a lista de produtos disponíveis
            modalRec.classList.add("ativo");
        });
    }

    const btnFecharRec = document.getElementById("btnFecharModalRec");
    if (btnFecharRec) {
        btnFecharRec.addEventListener("click", () => modalRec.classList.remove("ativo"));
    }

    // --- Modal Secundário: Versões ---
    const btnFecharVersoes = document.getElementById("btnFecharModalVersoes");
    if (btnFecharVersoes) {
        btnFecharVersoes.addEventListener("click", () => modalVersoes.classList.remove("ativo"));
    }
}

// Preenche a caixa de seleção com os produtos reais que criaste na tela "Produtos"
function carregarProdutosSelect() {
    const select = document.getElementById("recProduto");
    if (!select) return;
    
    select.innerHTML = '<option value="" disabled selected>Selecione o produto base...</option>';
    const produtos = JSON.parse(localStorage.getItem('produtos_db')) || [];
    
    produtos.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.nome;
        select.appendChild(opt);
    });
}

// ==========================================================================
// 4. GUARDAR DADOS (FORMULÁRIOS)
// ==========================================================================
function configurarFormularioReceita() {
    // Salvar Receita Base
    const formRec = document.getElementById("formReceita");
    if (formRec) {
        formRec.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nome = document.getElementById("recNome").value;
            const idProduto = parseInt(document.getElementById("recProduto").value);
            
            await ReceitaService.criarReceita(nome, idProduto);
            document.getElementById("modalReceita").classList.remove("ativo");
            renderizarTabelaReceitas();
        });
    }
    
    // Salvar Nova Versão de uma Receita
    const formVersao = document.getElementById("formVersao");
    if (formVersao) {
        formVersao.addEventListener("submit", async (e) => {
            e.preventDefault();
            const idReceita = parseInt(document.getElementById("vIdReceita").value);
            const numero = document.getElementById("vNumero").value;
            const status = document.getElementById("vStatus").value;
            const data = document.getElementById("vData").value;
            const desc = document.getElementById("vDescricao").value;

            await ReceitaService.criarVersao(numero, data, desc, idReceita, status);
            formVersao.reset();
            document.getElementById("vIdReceita").value = idReceita; // Restaura o ID oculto
            
            // Recarrega a tabela interna de versões
            renderizarTabelaVersoes(idReceita);
        });
    }
}

// ==========================================================================
// 5. AÇÕES GLOBAIS (APAGAR E GERIR VERSÕES)
// ==========================================================================
window.abrirModalVersoes = async function(idReceita, nomeReceita) {
    document.getElementById("modalVersoesTitulo").textContent = `Versões: ${nomeReceita}`;
    document.getElementById("vIdReceita").value = idReceita;
    document.getElementById("formVersao").reset();
    
    // Configura a data padrão para hoje
    document.getElementById("vData").value = new Date().toISOString().split('T')[0];
    
    await renderizarTabelaVersoes(idReceita);
    document.getElementById("modalVersoes").classList.add("ativo");
}

window.removerReceita = async function(id) {
    if(confirm("Deseja realmente excluir esta receita e todas as suas versões?")) {
        let receitas = JSON.parse(localStorage.getItem('receitas')) || [];
        receitas = receitas.filter(r => r.id !== id);
        localStorage.setItem('receitas', JSON.stringify(receitas));
        renderizarTabelaReceitas();
    }
}

// Renderiza a mini-tabela que fica dentro do Modal de Versões
async function renderizarTabelaVersoes(idReceita) {
    const tbody = document.getElementById("tabelaVersoesBody");
    if (!tbody) return;
    
    tbody.innerHTML = "";

    const versoes = await ReceitaService.listarVersoesPorReceita(idReceita);
    if (versoes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:15px; color:#888;">Nenhuma versão registada. Crie a v1.0 acima.</td></tr>`;
        return;
    }

    // Tradutor de Status para cores
    const statusMap = { "1": "Ativa", "2": "Em Teste", "3": "Obsoleta" };
    const corMap = { "1": "#198754", "2": "#DE9E52", "3": "#dc3545" };

    versoes.forEach(v => {
        const dataF = v.data_versao.split('-').reverse().join('/');
        const statusTxt = statusMap[v.idStatusVersaoReceita] || "Desconhecido";
        const cor = corMap[v.idStatusVersaoReceita] || "#666";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="padding: 12px 10px; font-weight: bold; color: #331E11;">v${v.numero_versao}</td>
            <td style="padding: 12px 10px;"><span style="color:${cor}; font-weight:bold; background-color: ${cor}15; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">${statusTxt}</span></td>
            <td style="padding: 12px 10px; color:#555;">${v.descricao}</td>
            <td style="padding: 12px 10px; color:#555;">${dataF}</td>
        `;
        tbody.appendChild(tr);
    });
}