const API_URL = "https://projeto-tcc-senai-production.up.railway.app";

// ==========================================================================
// 1. SERVIÇO DE COMUNICAÇÃO COM A API (substitui o localStorage)
// ==========================================================================
const EstoqueService = {
    listar: async () => {
        const res = await fetch(`${API_URL}/estoque`);
        if (!res.ok) throw new Error("Erro ao buscar dados do estoque");
        return await res.json();
    },

    buscarPorId: async (id) => {
        const res = await fetch(`${API_URL}/estoque/${id}`);
        if (!res.ok) throw new Error("Lote não encontrado");
        return await res.json();
    },

    salvar: async (movimento) => {
        // Monta o payload idêntico aos campos da Entidade Estoque do Java
        const payload = {
            lote: movimento.lote,
            qtdMinima: parseInt(movimento.qtdMinima),
            quantidade: parseInt(movimento.quantidade),
            dataFabricacao: movimento.dataFabricacao, 
            dataValidade: movimento.dataValidade, 
            produto: { 
                id: Long = Number(movimento.produtoId) 
            }
        };

        let res;
        if (movimento.idEdit && movimento.idEdit !== "") {
            res = await fetch(`${API_URL}/estoque/${movimento.idEdit}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        } else {
            res = await fetch(`${API_URL}/estoque`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        }

        if (!res.ok) {
            const erro = await res.json().catch(() => null);
            // Captura a mensagem de validação exata vinda do Java (ex: @Future ou @NotNull)
            throw new Error(erro?.mensagem || erro?.message || "Erro de validação no servidor");
        }

        return await res.json();
    },

    remover: async (id) => {
        const res = await fetch(`${API_URL}/estoque/${id}`, {
            method: "DELETE"
        });
        if (!res.ok) {
            const erro = await res.json().catch(() => null);
            throw new Error(erro?.mensagem || "Erro ao remover lote");
        }
    },

    verificarENotificar: (item) => {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const dataValidade = new Date(item.dataValidade + "T00:00:00");

        let alertas = [];

        if (dataValidade < hoje) {
            alertas.push(`❌ O lote "${item.lote}" foi salvo VENCIDO!`);
        } else {
            const diferencaDias = Math.ceil((dataValidade - hoje) / (1000 * 60 * 60 * 24));
            if (diferencaDias <= 10) {
                alertas.push(`⚠️ O lote "${item.lote}" está próximo do vencimento (${diferencaDias} dias restantes).`);
            }
        }

        if (parseInt(item.quantidade) < parseInt(item.qtdMinima)) {
            alertas.push(`📉 Alerta de Estoque: O lote "${item.lote}" está abaixo da quantidade mínima configurada!`);
        }

        if (alertas.length > 0) {
            alert(`[NOTIFICAÇÃO DE ESTOQUE]\n\n${alertas.join("\n")}`);
        }
    }
};

// ==========================================================================
// 2. SERVIÇO DE PRODUTOS (pra popular o select do modal)
// ==========================================================================
const ProdutoService = {
    listar: async () => {
        const res = await fetch(`${API_URL}/produtos`);
        if (!res.ok) throw new Error("Erro ao buscar produtos");
        return await res.json();
    }
};

// ==========================================================================
// 3. INICIALIZADOR GLOBAL DA TELA
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
    const nomePerfil = document.querySelector(".perfil span");
    if (nomePerfil) nomePerfil.textContent = usuarioLogado?.nome || "Usuário";

    renderizarTabelaEstoque().catch(err => {
        console.error("Erro ao carregar estoque:", err);
        const tbody = document.getElementById("tabelaEstoqueBody");
        if (tbody) tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:#c93b3b;">Erro ao conectar com o servidor.</td></tr>`;
    });

    inicializarModaisEstoque();
    configurarFormularioEstoque();
    configurarBuscaEstoque();
    configurarNavegacaoLateral();
});

// ==========================================================================
// 4. MODAL - ABRIR PARA NOVO LOTE
// ==========================================================================
function inicializarModaisEstoque() {
    const modal = document.getElementById("modalMovimentacao");
    const btnNovoLote = document.getElementById("btnNovoProduto") || document.getElementById("btnNovoLote");
    const btnFechar = document.getElementById("btnFecharModal");
    const form = document.getElementById("formMovimentacao");

    if (btnNovoLote) {
        btnNovoLote.addEventListener("click", async () => {
            if (form) form.reset();

            const inputEditId = document.getElementById("editIndex");
            if (inputEditId) inputEditId.value = "";

            const tituloModal = document.getElementById("modalTitulo");
            if (tituloModal) tituloModal.textContent = "Cadastrar Novo Lote no Estoque";

            try {
                await carregarProdutosSelect();
            } catch (err) {
                alert("Erro ao carregar lista de produtos: " + err.message);
            }

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
// 5. PREENCHIMENTO DINÂMICO DO SELECT DE PRODUTOS (agora via API)
// ==========================================================================
async function carregarProdutosSelect(idSelecionado = null) {
    const select = document.getElementById("movProduto");
    if (!select) return;

    select.innerHTML = '<option value="" disabled selected>Carregando produtos...</option>';

    try {
        const produtos = await ProdutoService.listar();

        select.innerHTML = '<option value="" disabled selected>Selecione o produto...</option>';

        produtos.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.text = p.nome;
            select.appendChild(option);
        });

        if (idSelecionado) {
            select.value = idSelecionado;
        }
    } catch (err) {
        select.innerHTML = '<option value="" disabled selected>Erro ao carregar produtos</option>';
        throw err;
    }
}

// ==========================================================================
// 6. EVENTO DO FORMULÁRIO E VALIDAÇÃO DE DATAS
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

            const dataFabObj = new Date(inputFab + "T00:00:00");
            const dataValObj = new Date(inputVal + "T00:00:00");

            if (dataValObj < dataFabObj) {
                alert("❌ Erro de Validação: A data de validade não pode ser menor que a data de fabricação!");
                return;
            }

            if (!selectProduto.value) {
                alert("❌ Selecione um produto válido!");
                return;
            }

            const btnSalvar = form.querySelector('button[type="submit"]');
            if (btnSalvar) btnSalvar.disabled = true; // evita duplo clique

            try {
                // Enviando as propriedades com nomenclatura clara e idêntica à que o salvar espera
                await EstoqueService.salvar({
                    idEdit: document.getElementById("editIndex").value,
                    produtoId: selectProduto.value,
                    lote: document.getElementById("movLote").value.trim(),
                    qtdMinima: parseInt(document.getElementById("movQtdMinima").value),
                    quantidade: parseInt(document.getElementById("movQuantidade").value),
                    dataFabricacao: inputFab,
                    dataValidade: inputVal
                });

                if (modal) modal.classList.remove("ativo");
                await renderizarTabelaEstoque();
            } catch (err) {
                alert(err.message);
            } finally {
                if (btnSalvar) btnSalvar.disabled = false;
            }
        });
    }
}

// ==========================================================================
// 7. RENDERIZAÇÃO DA TABELA E LEITOR DE STATUS
// ==========================================================================
async function renderizarTabelaEstoque(filtro = "") {
    const tbody = document.getElementById("tabelaEstoqueBody");
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px;">Carregando...</td></tr>`;

    try {
        const estoque = await EstoqueService.listar();

        // Garante o filtro sem quebrar caso venha algo nulo do backend
        const lotesFiltrados = estoque.filter(item => {
            const termo = filtro.toLowerCase();
            const nomeProd = item.produto || item.produtoNome || ""; 
            const numLote = item.lote || "";
            return nomeProd.toLowerCase().includes(termo) || numLote.toLowerCase().includes(termo);
        });

        tbody.innerHTML = "";

        if (lotesFiltrados.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:#555;">Nenhum lote encontrado no estoque.</td></tr>`;
            return;
        }

        // 1. Zera o horário local de hoje para o cálculo matemático exato
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        lotesFiltrados.forEach(item => {
            const tr = document.createElement("tr");

            // Validação das strings de data para evitar que o .split('-') quebre o código
            const dataFabFormatada = item.dataFabricacao ? item.dataFabricacao.split('-').reverse().join('/') : '-';
            const dataValFormatada = item.dataValidade ? item.dataValidade.split('-').reverse().join('/') : '-';

            // 2. Criação da data de validade usando inteiros (evita bugs de fuso horário)
            let diferencaDias = 0;
            if (item.dataValidade) {
                const [ano, mes, dia] = item.dataValidade.split('-');
                const dataValidade = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia), 0, 0, 0, 0);
                const diferencaTempo = dataValidade.getTime() - hoje.getTime();
                diferencaDias = Math.round(diferencaTempo / (1000 * 60 * 60 * 24));
            }

            let badgeStatusHtml = "";
            const qtdAtual = parseInt(item.quantidade) || 0;
            const qtdMinima = parseInt(item.qtdMinima) || 0;

            // Pega o status que vem do DTO (verifica maiúsculas/minúsculas)
            const statusVal = item.statusValidade || item.status || "";

            if (statusVal === "VENCIDO") {
                badgeStatusHtml += `<span style="display:block; margin-bottom:4px; padding:4px 8px; border-radius:12px; font-size:0.75rem; font-weight:bold; text-align:center; background-color:#dc3545; color:#fff;">❌ Vencido</span>`;
            } else if (statusVal === "PERTO_DE_VENCER") {
                badgeStatusHtml += `<span style="display:block; margin-bottom:4px; padding:4px 8px; border-radius:12px; font-size:0.75rem; font-weight:bold; text-align:center; background-color:#ffc107; color:#000;">⚠️ Próximo (${diferencaDias} dias)</span>`;
            } else {
                badgeStatusHtml += `<span style="display:block; margin-bottom:4px; padding:4px 8px; border-radius:12px; font-size:0.75rem; font-weight:bold; text-align:center; background-color:#198754; color:#fff;">✔️ Seguro</span>`;
            }

            if (qtdAtual < qtdMinima) {
                badgeStatusHtml += `<span style="display:block; padding:4px 8px; border-radius:12px; font-size:0.75rem; font-weight:bold; text-align:center; background-color:#fd7e14; color:#fff;">📉 Estoque Baixo</span>`;
            } else {
                badgeStatusHtml += `<span style="display:block; padding:4px 8px; border-radius:12px; font-size:0.75rem; font-weight:bold; text-align:center; background-color:#0dcaf0; color:#000;">📦 Saldo OK</span>`;
            }

            // Tenta ler 'item.produto' (do seu DTO). Se não existir, tenta 'item.produtoNome'
            const exibeNomeProduto = item.produto || item.produtoNome || "Não informado";

            tr.innerHTML = `
                <td><strong>${item.lote || '-'}</strong></td>
                <td>${exibeNomeProduto}</td>
                <td style="text-align: center;">${qtdMinima}</td>
                <td style="text-align: center; font-weight: bold;">${qtdAtual}</td>
                <td style="text-align: center;">${dataFabFormatada}</td>
                <td style="text-align: center;">${dataValFormatada}</td>
                <td>${badgeStatusHtml}</td>
                <td>
                    <div class="grupo-acoes">
                        <button class="btn-acao editar" onclick="abrirEdicaoEstoque(${item.id})" title="Editar Lote">
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
    } catch (err) {
        console.error("Erro ao renderizar:", err);
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:#c93b3b;">Erro ao renderizar dados da tabela.</td></tr>`;
    }
}

// ==========================================================================
// 8. EDIÇÃO E EXCLUSÃO
// ==========================================================================
window.abrirEdicaoEstoque = async function (id) {
    const modal = document.getElementById("modalMovimentacao");
    const tituloModal = document.getElementById("modalTitulo");

    try {
        // Busca os dados atualizados direto da API (não confia só no que já está na tabela)
        const item = await EstoqueService.buscarPorId(id);

        if (tituloModal) tituloModal.textContent = "Editar Dados do Lote";

        document.getElementById("editIndex").value = id;
        document.getElementById("movLote").value = item.lote;
        document.getElementById("movQtdMinima").value = item.qtdMinima;
        document.getElementById("movQuantidade").value = item.quantidade;
        document.getElementById("movFab").value = item.dataFabricacao;
        document.getElementById("movVal").value = item.dataValidade;

        await carregarProdutosSelect(item.produtoId);

        if (modal) modal.classList.add("ativo");
    } catch (err) {
        alert("Erro ao carregar dados do lote: " + err.message);
    }
};

window.removerEstoque = async function (id) {
    if (confirm("⚠️ Tem certeza que deseja excluir permanentemente este lote do estoque?")) {
        try {
            await EstoqueService.remover(id);
            await renderizarTabelaEstoque();
        } catch (err) {
            alert(err.message);
        }
    }
};

// ==========================================================================
// 9. BARRA DE BUSCA DINÂMICA
// ==========================================================================
function configurarBuscaEstoque() {
    const inputBusca = document.getElementById("buscaEstoque");
    if (inputBusca) {
        inputBusca.addEventListener("input", (e) => {
            renderizarTabelaEstoque(e.target.value).catch(err => console.error(err));
        });
    }
}

// ==========================================================================
// 10. NAVEGAÇÃO LATERAL (sem mudanças, não depende de dados)
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