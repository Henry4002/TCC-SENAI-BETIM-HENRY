// ==========================================================================
// 1. CAMADA DE SERVIÇO (Persistência no localStorage)
// ==========================================================================
const EstoqueService = {
    listar: async () => JSON.parse(localStorage.getItem('estoque_db')) || [],
    
     salvar: async (movimento) => {
        let estoque = await EstoqueService.listar();

        if (movimento.idEdit && movimento.idEdit !== "") {
            // Cenário de Edição de Lote existente
            // Usamos '==' (dois iguais) para ele ignorar se o ID é texto ou número
            const index = estoque.findIndex(m => m.id == movimento.idEdit);

            if (index !== -1) {
                // Se encontrou o item, atualiza
                movimento.id = estoque[index].id; // Garante o ID original
                delete movimento.idEdit; // Limpa o campo de controle
                estoque[index] = movimento;
            } else {
                // Proteção: Se por acaso não encontrar, salva como novo para não perder o dado
                movimento.id = Date.now();
                delete movimento.idEdit;
                estoque.push(movimento);
            }
        } else {
            // Cenário de Criação de Novo Lote
            movimento.id = Date.now();
            delete movimento.idEdit;
            estoque.push(movimento);
        }

        localStorage.setItem('estoque_db', JSON.stringify(estoque));
        
        // REQUISITO: Notificar ativamente o usuário sobre irregularidades no lote salvo
        EstoqueService.verificarENotificar(movimento);
    },

    remover: async (id) => {
        let estoque = await EstoqueService.listar();
        localStorage.setItem('estoque_db', JSON.stringify(estoque.filter(m => m.id != id)));
    },

    verificarENotificar: (item) => {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const dataValidade = new Date(item.dataVal + "T00:00:00");

        let alertas = [];

        if (dataValidade < hoje) {
            alertas.push(`❌ O lote "${item.lote}" foi salvo VENCIDO!`);
        } else {
            const diferencaDias = Math.ceil((dataValidade - hoje) / (1000 * 60 * 60 * 24));
            if (diferencaDias <= 10) {
                alertas.push(`⚠️ O lote "${item.lote}" está próximo do vencimento (${diferencaDias} dias restantes).`);
            }
        }

        if (parseInt(item.qtdAtual) < parseInt(item.qtdMinima)) {
            alertas.push(`📉 Alerta de Estoque: O lote "${item.lote}" está abaixo da quantidade mínima configurada!`);
        }

        if (alertas.length > 0) {
            alert(`[NOTIFICAÇÃO DE ESTOQUE]\n\n${alertas.join("\n")}`);
        }
    }
};

// ==========================================================================
// 2. INICIALIZADOR GLOBAL DA TELA
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    // Mantém o nome fixo no perfil se o elemento existir
    const nomePerfil = document.querySelector(".perfil span");
    if (nomePerfil) nomePerfil.textContent = "Leandro";

    // Inicializa todos os módulos necessários da UI
    renderizarTabelaEstoque();
    inicializarModaisEstoque();
    configurarFormularioEstoque();
    configurarBuscaEstoque();
    configurarNavegacaoLateral();
});

// ==========================================================================
// 3. FUNCIONALIDADE DO BOTÃO NOVO LOTE E MODAL
// ==========================================================================
function inicializarModaisEstoque() {
    const modal = document.getElementById("modalMovimentacao");
    // Mapeia tanto btnNovoProduto quanto btnNovoLote para evitar falhas de nomenclatura do HTML
    const btnNovoLote = document.getElementById("btnNovoProduto") || document.getElementById("btnNovoLote");
    const btnFechar = document.getElementById("btnFecharModal");
    const form = document.getElementById("formMovimentacao");

    // Torna o botão Novo Lote funcional e reseta campos para nova inserção limpa
    if (btnNovoLote) {
        btnNovoLote.addEventListener("click", () => {
            if (form) form.reset();
            
            const inputEditId = document.getElementById("editIndex");
            if (inputEditId) inputEditId.value = ""; // Limpa ID de edição anterior
            
            const tituloModal = document.getElementById("modalTitulo");
            if (tituloModal) tituloModal.textContent = "Cadastrar Novo Lote no Estoque";
            
            carregarProdutosSelect(); // Preenche a lista de produtos de forma limpa
            if (modal) modal.classList.add("ativo");
        });
    }

    if (btnFechar) {
        btnFechar.addEventListener("click", () => {
            if (modal) modal.classList.remove("ativo");
        });
    }
}
// ==========================================================================
// 4. PREENCHIMENTO DINÂMICO DO SELECT DE PRODUTOS
// ==========================================================================
async function carregarProdutosSelect(idSelecionado = null) {
    const select = document.getElementById("movProduto");
    if (!select) return;

    select.innerHTML = '<option value="" disabled selected>Selecione o produto...</option>';
    
    // Carrega do banco correto de produtos (produtos_db)
    const produtos = JSON.parse(localStorage.getItem('produtos_db')) || [];
    
    produtos.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.text = p.nome;
        select.appendChild(option);
    });

    if (idSelecionado) {
        select.value = idSelecionado;
    }
}

// ==========================================================================
// 5. EVENTO DO FORMULÁRIO E VALIDAÇÃO DE DATAS Exigidas
// ==========================================================================
function configurarFormularioEstoque() {
    const form = document.getElementById("formMovimentacao");
    const modal = document.getElementById("modalMovimentacao");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const selectProduto = document.getElementById("movProduto");
            const inputFab = document.getElementById("movFab").value;
            const inputVal = document.getElementById("movVal").value;

            // REQUISITO: Data de validade não pode ser menor que a data de fabricação do produto
            const dataFabObj = new Date(inputFab + "T00:00:00");
            const dataValObj = new Date(inputVal + "T00:00:00");

            if (dataValObj < dataFabObj) {
                alert("❌ Erro de Validação: A data de validade não pode ser menor que a data de fabricação!");
                return; // Bloqueia o salvamento
            }

            if (!selectProduto.value) {
                alert("❌ Selecione um produto válido!");
                return;
            }

            const produtoId = selectProduto.value;
            const produtoNome = selectProduto.options[selectProduto.selectedIndex].text;

            // Coleta de todos os campos requisitados
            await EstoqueService.salvar({
                idEdit: document.getElementById("editIndex").value,
                produtoId: produtoId,
                nomeProduto: produtoNome,
                lote: document.getElementById("movLote").value.trim(),
                qtdMinima: parseInt(document.getElementById("movQtdMinima").value),
                qtdAtual: parseInt(document.getElementById("movQuantidade").value),
                dataFab: inputFab,
                dataVal: inputVal
            });

            if (modal) modal.classList.remove("ativo");
            renderizarTabelaEstoque();
        });
    }
}

// ==========================================================================
// 6. RENDERIZAÇÃO DA TABELA E LEITOR DE STATUS INTELIGENTE
// ==========================================================================
async function renderizarTabelaEstoque(filtro = "") {
    const tbody = document.getElementById("tabelaEstoqueBody");
    if (!tbody) return;

    tbody.innerHTML = "";
    const estoque = await EstoqueService.listar();
    
    // Filtra lotes válidos
    const lotesValidos = estoque.filter(item => item && item.id && item.lote);

    const lotesFiltrados = lotesValidos.filter(item => {
        const termo = filtro.toLowerCase();
        // A interrogação (?.) e o || "" protegem o código caso o lote antigo não tenha esses nomes definidos
        const nomeProd = item.nomeProduto || item.produtoNome || "";
        const numLote = item.lote || "";
        
        return nomeProd.toLowerCase().includes(termo) || numLote.toLowerCase().includes(termo);
    });

    if (lotesFiltrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:#555;">Nenhum lote encontrado no estoque.</td></tr>`;
        return;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    lotesFiltrados.forEach(item => {
        const tr = document.createElement("tr");

        // Formatação visual brasileira para as datas (DD/MM/AAAA)
        const dataFabFormatada = item.dataFab ? item.dataFab.split('-').reverse().join('/') : '-';
        const dataValFormatada = item.dataVal ? item.dataVal.split('-').reverse().join('/') : '-';
        // ------------------------------------------------------------------
        // REQUISITO: LEITOR DE STATUS (INTERPRETAÇÃO DE PROXIMIDADE E ESTOQUE)
        // ------------------------------------------------------------------
        const dataValidade = new Date(item.dataVal + "T00:00:00");
        const diferencaDias = Math.ceil((dataValidade - hoje) / (1000 * 60 * 60 * 24));
        
        let badgeStatusHtml = "";
        const qtdAtual = parseInt(item.qtdAtual);
        const qtdMinima = parseInt(item.qtdMinima);

        // 1. Interpretação do Status de Validade (Próximo ou Distante)
        if (dataValidade < hoje) {
            badgeStatusHtml += `<span style="display:block; margin-bottom:4px; padding:4px 8px; border-radius:12px; font-size:0.75rem; font-weight:bold; text-align:center; background-color:#dc3545; color:#fff;">❌ Vencido</span>`;
        } else if (diferencaDias <= 10) {
            badgeStatusHtml += `<span style="display:block; margin-bottom:4px; padding:4px 8px; border-radius:12px; font-size:0.75rem; font-weight:bold; text-align:center; background-color:#ffc107; color:#000;">⚠️ Próximo (${diferencaDias} dias)</span>`;
        } else {
            badgeStatusHtml += `<span style="display:block; margin-bottom:4px; padding:4px 8px; border-radius:12px; font-size:0.75rem; font-weight:bold; text-align:center; background-color:#198754; color:#fff;">✔️ Distante (Seguro)</span>`;
        }

        // 2. Interpretação da Quantidade em Estoque
        if (qtdAtual < qtdMinima) {
            badgeStatusHtml += `<span style="display:block; padding:4px 8px; border-radius:12px; font-size:0.75rem; font-weight:bold; text-align:center; background-color:#fd7e14; color:#fff;">📉 Estoque Baixo</span>`;
        } else {
            badgeStatusHtml += `<span style="display:block; padding:4px 8px; border-radius:12px; font-size:0.75rem; font-weight:bold; text-align:center; background-color:#0dcaf0; color:#000;">📦 Saldo OK</span>`;
        }

        // Injeção da linha na tabela com as colunas requisitadas
        tr.innerHTML = `
            <td><strong>${item.lote}</strong></td>
            <td>${item.nomeProduto}</td>
            <td style="text-align: center;">${item.qtdMinima}</td>
            <td style="text-align: center; font-weight: bold;">${item.qtdAtual}</td>
            <td style="text-align: center;">${dataFabFormatada}</td>
            <td style="text-align: center;">${dataValFormatada}</td>
            <td>${badgeStatusHtml}</td>
            <td>
                <div class="grupo-acoes">
                    <button class="btn-acao editar" onclick="abrirEdicaoEstoque(${item.id}, '${item.produtoId}', '${item.lote}', ${item.qtdMinima}, ${item.qtdAtual}, '${item.dataFab}', '${item.dataVal}')" title="Editar Lote">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-acao excluir" onclick="removerEstoque(${item.id})" title="Excluir Lote">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ==========================================================================
// 7. BOTOES DE EDICAO E EXCLUSAO DA TABELA
// ==========================================================================
window.abrirEdicaoEstoque = function(id, produtoId, lote, qtdMinima, qtdAtual, dataFab, dataVal) {
    const modal = document.getElementById("modalMovimentacao");
    const tituloModal = document.getElementById("modalTitulo");
    
    if (tituloModal) tituloModal.textContent = "Editar Dados do Lote";
    
    document.getElementById("editIndex").value = id;
    document.getElementById("movLote").value = lote;
    document.getElementById("movQtdMinima").value = qtdMinima;
    document.getElementById("movQuantidade").value = qtdAtual;
    document.getElementById("movFab").value = dataFab;
    document.getElementById("movVal").value = dataVal;
    
    // Carrega o select marcando o produto correto deste lote
    carregarProdutosSelect(produtoId);
    
    if (modal) modal.classList.add("ativo");
}

window.removerEstoque = async function(id) {
    if (confirm("⚠️ Tem certeza que deseja excluir permanentemente este lote do estoque?")) {
        await EstoqueService.remover(id);
        renderizarTabelaEstoque();
    }
}

// ==========================================================================
// 8. BARRA DE BUSCA DINÂMICA
// ==========================================================================
function configurarBuscaEstoque() {
    const inputBusca = document.getElementById("buscaEstoque");
    if (inputBusca) {
        inputBusca.addEventListener("input", (e) => {
            renderizarTabelaEstoque(e.target.value);
        });
    }
}

// ==========================================================================
// 9. DIRECIONAMENTO DA NAVEGAÇÃO LATERAL
// ==========================================================================
function configurarNavegacaoLateral() {
    const itensMenu = document.querySelectorAll("aside ul li");
    
    itensMenu.forEach(item => {
        if (!item.hasAttribute("tabindex")) {
            item.setAttribute("tabindex", "0");
            item.setAttribute("role", "button");
        }

        const executarNavegacao = (novaAba = false) => {
            const modulo = item.textContent.trim().toLowerCase();
            let urlDestino = "";

            if (modulo.includes("produtos")) urlDestino = "produtos.html";
            else if (modulo.includes("início") || modulo.includes("inicio")) urlDestino = "telaInicial.html";
            else if (modulo.includes("estoque")) urlDestino = "estoque.html";
            else if (modulo.includes("receitas")) urlDestino = "receitas.html";
            else if (modulo.includes("testes")) urlDestino = "testes.html";

            if (urlDestino) {
                if (novaAba) window.open(urlDestino, "_blank");
                else window.location.href = urlDestino;
            }
        };

        item.addEventListener("mouseup", (e) => {
            if (e.button === 0) executarNavegacao(false);
            else if (e.button === 1) executarNavegacao(true);
        });

        item.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                executarNavegacao(false);
            }
        });
    });
}