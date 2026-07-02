document.addEventListener("DOMContentLoaded", () => {
    /* BLOQUEIO DE LOGIN DESATIVADO PARA TESTES
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || null;
    if (!usuarioLogado) {
        window.location.href = "login.html";
        return;
    }
    */

    const nomePerfil = document.querySelector(".perfil span");
    if (nomePerfil) {
        nomePerfil.textContent = "Leandro";
    }
    
    // ... restante do teu código original da tela inicial (menu mobile, etc.)

    // Inicializa todas as funções locais da tela
    inicializarModal();
    renderizarTabelaProdutos();
    configurarFormulario();
    configurarNavegacaoLateral();
});

// ==========================================================================
// 2. CONTROLE DO MODAL (ABRIR / FECHAR)
// ==========================================================================
function inicializarModal() {
    const modal = document.getElementById("modalCadastro");
    const btnAbrir = document.getElementById("btnAbrirModal"); 
    const btnFechar = document.getElementById("btnFecharModal");

    if (!modal || !btnAbrir || !btnFechar) return;

    // Abre o modal ao clicar no botão principal
    btnAbrir.addEventListener("click", () => {
        modal.classList.add("ativo");
        document.getElementById("formProduto").reset(); // Limpa dados anteriores
        modal.setAttribute("aria-hidden", "false");
    });

    // Fecha o modal ao clicar no "X"
    btnFechar.addEventListener("click", () => {
        modal.classList.remove("ativo");
        modal.setAttribute("aria-hidden", "true");
    });

    // Fecha o modal ao clicar na parte escura de fora
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.classList.remove("ativo");
            modal.setAttribute("aria-hidden", "true");
        }
    });
}

// ==========================================================================
// 3. RENDERIZAÇÃO DA TABELA (BANCO LOCAL PROVISÓRIO)
// ==========================================================================
function renderizarTabelaProdutos() {
    const tabelaBody = document.getElementById("tabelaProdutosBody");
    if (!tabelaBody) return;

    // Busca os produtos já salvos ou cria o primeiro item de exemplo
    let produtos = JSON.parse(localStorage.getItem("produtos")) || [
        { id: 1001, lote: "LT-PR-2026-01", nome: "Pão Francês", categoria: "Panificação", minimo: 50 }
    ];

    // Salva o padrão caso o localStorage esteja zerado
    if (!localStorage.getItem("produtos")) {
        localStorage.setItem("produtos", JSON.stringify(produtos));
    }

    tabelaBody.innerHTML = ""; // Limpa linhas antigas antes de renderizar

    produtos.forEach((produto, index) => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>#${produto.id}</td>
            <td>${produto.lote}</td>
            <td>${produto.nome}</td>
            <td>${produto.categoria}</td>
            <td>${produto.minimo} un</td>
            <td>
                <button class="btn-acao editar" title="Editar" onclick="editarProduto(${index})">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn-acao excluir" title="Excluir" onclick="excluirProduto(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tabelaBody.appendChild(linha);
    });
}

// ==========================================================================
// 4. PROCESSAMENTO E CADASTRO DO FORMULÁRIO
// ==========================================================================
function configurarFormulario() {
    const form = document.getElementById("formProduto");
    const modal = document.getElementById("modalCadastro");

    if (form && modal) {
        form.addEventListener("submit", (event) => {
            event.preventDefault(); // Impede a página de recarregar

            let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

            // Captura os dados dos inputs e gera um id incremental sequencial
            const novoProduto = {
                id: produtos.length > 0 ? produtos[produtos.length - 1].id + 1 : 1001,
                lote: document.getElementById("prodLote").value.trim(),
                nome: document.getElementById("prodNome").value.trim(),
                categoria: document.getElementById("prodCategoria").value,
                minimo: parseInt(document.getElementById("prodMinimo").value)
            };

            produtos.push(novoProduto);
            localStorage.setItem("produtos", JSON.stringify(produtos)); // Grava no banco simulado

            modal.classList.remove("ativo"); // Esconde o modal
            renderizarTabelaProdutos();      // Atualiza a tabela imediatamente
        });
    }
}

// ==========================================================================
// 5. AÇÕES (EXCLUIR / EDITAR)
// ==========================================================================
function excluirProduto(index) {
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    
    if (confirm(`Deseja realmente remover o produto "${produtos[index].nome}"?`)) {
        produtos.splice(index, 1);
        localStorage.setItem("produtos", JSON.stringify(produtos));
        renderizarTabelaProdutos();
    }
}

function editarProduto(index) {
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    alert(`Editar selecionado para: ${produtos[index].nome} (Funcionalidade futura)`);
}

// ==========================================================================
// 6. NAVEGAÇÃO LATERAL
// ==========================================================================
function configurarNavegacaoLateral() {
    const itensMenu = document.querySelectorAll("aside ul li");

    itensMenu.forEach(item => {
        item.addEventListener("click", () => processarCliqueMenu(item));
        item.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault(); 
                processarCliqueMenu(item);
            }
        });
    });
}

function processarCliqueMenu(itemClicado) {
    const texto = itemClicado.innerText || itemClicado.textContent;
    const modulo = texto.trim().toLowerCase();

    if (modulo.includes("produtos")) {
        window.location.href = "produtos.html";
    } else if (modulo.includes("início") || modulo.includes("inicio")) {
        window.location.href = "telaInicial.html";
    }
}