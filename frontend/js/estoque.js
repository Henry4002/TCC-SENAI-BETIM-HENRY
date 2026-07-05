document.addEventListener("DOMContentLoaded", () => {
    const nomePerfil = document.querySelector(".perfil span");
    if (nomePerfil) nomePerfil.textContent = "Leandro";

    renderizarTabelaEstoque();
    inicializarModaisEstoque();
    configurarFormularioEstoque();
    configurarBuscaEstoque();
    configurarNavegacaoLateral();
    configurarRestricoesDeDatas();
});

// ==========================================================================
// RENDERIZAR TABELA COM NOVA COLUNA DE LOTE FORMATADA
// ==========================================================================
function renderizarTabelaEstoque(filtro = "") {
    const tbody = document.getElementById("tabelaEstoqueBody");
    if (!tbody) return;

    let estoque = JSON.parse(localStorage.getItem("estoque")) || [];
    tbody.innerHTML = "";

    const agora = new Date();
    const hojeAno = agora.getFullYear();
    const hojeMes = agora.getMonth() + 1;
    const hojeDia = agora.getDate();
    const hojeChaveNumerica = (hojeAno * 10000) + (hojeMes * 100) + hojeDia;

    let temDados = false;
    let houveModificacao = false;

    estoque.forEach((item, index) => {
        if (!item || !item.id || !item.nomeProduto) return;

        // Auto-correção higiênica para dados antigos de teste
        if (item.data_validade && item.data_validade.includes("-")) {
            let partesV = item.data_validade.split("-");
            if (parseInt(partesV[0]) < 2025) {
                partesV[0] = "2026"; 
                item.data_validade = partesV.join("-");
                houveModificacao = true;
            }
        }
        if (item.data_fabricacao && item.data_fabricacao.includes("-")) {
            let partesF = item.data_fabricacao.split("-");
            if (parseInt(partesF[0]) < 2025) {
                partesF[0] = "2026";
                item.data_fabricacao = partesF.join("-");
                houveModificacao = true;
            }
        }

        if (filtro && !item.nomeProduto.toLowerCase().includes(filtro.toLowerCase())) {
            return;
        }
        temDados = true;

        const atual = parseInt(item.quantidade || 0);
        const minimo = parseInt(item.qtd_minima || 0);
        
        let txtSituacao = "Ativo 🟢";
        let corEstilo = "background-color: #d4edda; color: #155724; font-weight:bold; padding:4px 8px; border-radius:4px; border: 1px solid #c3e6cb;";

        if (item.data_validade) {
            const partesVal = item.data_validade.split("-");
            const valAno = parseInt(partesVal[0]);
            const valMes = parseInt(partesVal[1]);
            const valDia = parseInt(partesVal[2]);
            const validadeChaveNumerica = (valAno * 10000) + (valMes * 100) + valDia;

            if (validadeChaveNumerica < hojeChaveNumerica) {
                txtSituacao = "Vencido 🔴";
                corEstilo = "background-color: #f8d7da; color: #721c24; font-weight:bold; padding:4px 8px; border-radius:4px; border: 1px solid #f5c6cb;";
            } else {
                const dataValObjeto = new Date(valAno, valMes - 1, valDia);
                const dataHojeObjeto = new Date(hojeAno, hojeMes - 1, hojeDia);
                const diferencaTempo = dataValObjeto.getTime() - dataHojeObjeto.getTime();
                const diferencaDias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));

                if (diferencaDias >= 0 && diferencaDias <= 3) {
                    txtSituacao = "Atenção 🟡";
                    corEstilo = "background-color: #fff3cd; color: #856404; font-weight:bold; padding:4px 8px; border-radius:4px; border: 1px solid #ffeeba;";
                }
            }
        }

        if (txtSituacao === "Ativo 🟢" && atual <= minimo) {
            txtSituacao = "Baixo Estoque ⚠️";
            corEstilo = "background-color: #fff3cd; color: #b25900; font-weight:bold; padding:4px 8px; border-radius:4px; border: 1px solid #ffeeba;";
        }

        const dtValidadeFormatada = item.data_validade ? item.data_validade.split("-").reverse().join("/") : "---";
        const dtFabricacaoFormatada = item.data_fabricacao ? item.data_fabricacao.split("-").reverse().join("/") : "---";

        // Formatação visual em tag cinza para o código do Lote
        const tagLoteFormatada = `<span style="background-color: #f1f3f5; color: #495057; border: 1px solid #dee2e6; font-family: monospace; font-weight: bold; padding: 4px 8px; border-radius: 4px; font-size: 0.9rem;">${item.lote || 'N/A'}</span>`;

        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td><strong>#${item.id}</strong></td>
            <td>${item.nomeProduto}</td>
            <td>${tagLoteFormatada}</td>
            <td>${minimo} un</td>
            <td><strong>${atual} un</strong></td>
            <td>${dtFabricacaoFormatada}</td>
            <td>${dtValidadeFormatada}</td>
            <td><span style="${corEstilo}">${txtSituacao}</span></td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="btn-principal" style="padding: 6px 12px; font-size: 0.85rem; background-color: #6c757d; border:none; color:#fff; border-radius:4px; cursor:pointer;" onclick="editarEstoque(${index})">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-principal" style="padding: 6px 12px; font-size: 0.85rem; background-color: #dc3545; border:none; color:#fff; border-radius:4px; cursor:pointer;" onclick="removerEstoque(${index})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(linha);
    });

    if (houveModificacao) {
        localStorage.setItem("estoque", JSON.stringify(estoque));
    }

    if (!temDados) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:#999; padding:20px;">Nenhum item cadastrado no estoque.</td></tr>`;
    }
}

// ==========================================================================
// PROCESSAMENTO DO FORMULÁRIO CAPTURANDO O LOTE
// ==========================================================================
function configurarFormularioEstoque() {
    const form = document.getElementById("formMovimentacao");
    
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault(); // Impede a página de recarregar
            
            // Aqui tu pegas os valores dos inputs (movLote, movQtdMinima, movQuantidade, etc.)
            // ... (a tua lógica de salvar no LocalStorage ou Banco de Dados entra aqui) ...

            // Depois de salvar, fechas o modal e atualizas a tabela
            document.getElementById("modalMovimentacao").classList.remove("ativo");
            renderizarTabelaEstoque(); 
        });
    }
}

// ==========================================================================
// CARREGAR DADOS NO MODO EDIÇÃO
// ==========================================================================
window.editarEstoque = function(index) {
    let estoque = JSON.parse(localStorage.getItem("estoque")) || [];
    const item = estoque[index];
    if (!item) return;

    document.getElementById("editIndex").value = index;
    document.getElementById("modalMovTitulo").textContent = "Editar Registro de Estoque";
    
    document.getElementById("movLote").value = item.lote || ""; // Carrega o lote salvo
    document.getElementById("movQtdMinima").value = item.qtd_minima;
    document.getElementById("movQuantidade").value = item.quantidade;
    document.getElementById("movFab").value = item.data_fabricacao;
    document.getElementById("movVal").value = item.data_validade;
    document.getElementById("movVal").min = item.data_fabricacao;

    carregarSelectProdutos(item.idProduto);
    document.getElementById("movProduto").disabled = true; 

    document.getElementById("modalMovimentacao").classList.add("ativo");
}

// ==========================================================================
// RESTO DOS COMPONENTES DE SUPORTE MANTIDOS INTACTOS
// ==========================================================================
function configurarRestricoesDeDatas() {
    const inputFab = document.getElementById("movFab");
    const inputVal = document.getElementById("movVal");
    if (!inputFab || !inputVal) return;

    inputFab.addEventListener("change", () => {
        if (inputFab.value) inputVal.min = inputFab.value;
    });

    [inputFab, inputVal].forEach(input => {
        input.addEventListener("input", () => {
            const valor = input.value; 
            if (valor && valor.includes("-")) {
                const ano = valor.split("-")[0];
                if (ano.length > 4) {
                    input.value = ano.substring(0, 4) + valor.substring(ano.length);
                }
            }
        });
    });
}

function carregarSelectProdutos(idSelecionado = "") {
    const selectProdutos = document.getElementById("movProduto");
    if (!selectProdutos) return;

    let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    selectProdutos.innerHTML = '<option value="" disabled selected>Selecione o produto base...</option>';
    
    produtos.forEach((p) => {
        const selected = p.id.toString() === idSelecionado.toString() ? "selected" : "";
        selectProdutos.innerHTML += `<option value="${p.id}" data-nome="${p.nome}" ${selected}>${p.nome} (ID #${p.id})</option>`;
    });
}

function inicializarModaisEstoque() {
    const modal = document.getElementById("modalMovimentacao");
    const form = document.getElementById("formMovimentacao");
    
    // 1. Abrir Modal para um Novo Lote
    const btnNovo = document.getElementById("btnNovoMovimento");
    if (btnNovo) {
        btnNovo.addEventListener("click", () => {
            form.reset();
            document.getElementById("editIndex").value = "";
            carregarProdutosSelect(); // Função que carrega a lista de produtos no select
            document.getElementById("modalTitulo").textContent = "Adicionar Novo Lote";
            modal.classList.add("ativo"); // O segredo para a janela aparecer!
        });
    }

    // 2. Fechar Modal
    const btnFechar = document.getElementById("btnFecharModal");
    if (btnFechar) {
        btnFechar.addEventListener("click", () => {
            modal.classList.remove("ativo");
        });
    }
}

window.removerEstoque = function(index) {
    let estoque = JSON.parse(localStorage.getItem("estoque")) || [];
    if (confirm(`Pretende mesmo remover o registro de estoque do produto "${estoque[index].nomeProduto}"?`)) {
        estoque.splice(index, 1);
        localStorage.setItem("estoque", JSON.stringify(estoque));
        renderizarTabelaEstoque();
    }
}

function configurarBuscaEstoque() {
    const input = document.getElementById("buscaEstoque");
    if (input) input.addEventListener("input", (e) => renderizarTabelaEstoque(e.target.value));
}

// ==========================================================================
// NAVEGAÇÃO LATERAL (Mouse e Teclado / Acessibilidade)
// ==========================================================================
function configurarNavegacaoLateral() {
    const itensMenu = document.querySelectorAll("aside ul li");
    
    itensMenu.forEach(item => {
        // Garante que todos os itens do menu tenham acessibilidade caso o HTML não tenha
        if (!item.hasAttribute("tabindex")) {
            item.setAttribute("tabindex", "0");
            item.setAttribute("role", "button");
        }

        // Função centralizada para decidir para onde ir
        const executarNavegacao = (novaAba = false) => {
            const modulo = item.textContent.trim().toLowerCase();
            let urlDestino = "";

            if (modulo.includes("produtos")) urlDestino = "produtos.html";
            else if (modulo.includes("início") || modulo.includes("inicio")) urlDestino = "telaInicial.html";
            else if (modulo.includes("estoque")) urlDestino = "estoque.html";
            else if (modulo.includes("receitas")) urlDestino = "receitas.html";
            // Os próximos módulos (testes, usuários) entrarão aqui depois

            if (urlDestino) {
                if (novaAba) window.open(urlDestino, "_blank");
                else window.location.href = urlDestino;
            }
        };

        // 1. Ouvinte para Mouse (Clique Esquerdo e Clique do Meio)
        item.addEventListener("mouseup", (e) => {
            if (e.button === 0) executarNavegacao(false);      // Clique Esquerdo (Mesma aba)
            else if (e.button === 1) executarNavegacao(true);  // Clique do Meio (Nova aba)
        });

        // 2. Ouvinte para Teclado (Acessibilidade via TAB)
        item.addEventListener("keydown", (e) => {
            // Se o usuário apertar Enter ou Barra de Espaço enquanto focado no item
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault(); // Evita que a página role para baixo ao apertar espaço
                executarNavegacao(false); // Navega na mesma aba
            }
        });
    });
}