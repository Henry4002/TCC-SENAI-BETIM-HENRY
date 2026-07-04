document.addEventListener("DOMContentLoaded", () => {
    const nomePerfil = document.querySelector(".perfil span");
    if (nomePerfil) {
        nomePerfil.textContent = "Leandro";
    }

    inicializarModal();
    renderizarTabelaProdutos();
    configurarFormulario();
    configurarNavegacaoLateral();
});

// ==========================================================================
// CONTROLE DO MODAL (ABRIR / FECHAR)
// ==========================================================================
function inicializarModal() {
    const modal = document.getElementById("modalCadastro");
    const btnAbrir = document.getElementById("btnNovoProduto");
    const btnFechar = document.getElementById("btnFecharModal");

    if (!modal || !btnAbrir || !btnFechar) return;

    btnAbrir.addEventListener("click", () => {
        document.getElementById("formCadastroProduto").reset();
        modal.classList.add("ativo");
    });

    btnFechar.addEventListener("click", () => {
        modal.classList.remove("ativo");
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("ativo");
        }
    });
}

// ==========================================================================
// RENDERIZAR TABELA DE PRODUTOS (MOSTRANDO APENAS NOME E DESCRIÇÃO)
// ==========================================================================
function renderizarTabelaProdutos(filtro = "") {
    const tbody = document.getElementById("tabelaProdutosBody");
    if (!tbody) return;

    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    tbody.innerHTML = "";

    let temDados = false;

    produtos.forEach((prod, index) => {
        if (filtro && !prod.nome.toLowerCase().includes(filtro.toLowerCase())) {
            return;
        }
        temDados = true;

        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td><strong>#${prod.id}</strong></td>
            <td>${prod.nome}</td>
            <td><span style="font-size: 0.9rem; color: #555;">${prod.descricao}</span></td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="btn-principal" style="padding: 6px 12px; font-size: 0.85rem; background-color: #6c757d;" onclick="editarProduto(${index})">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-principal" style="padding: 6px 12px; font-size: 0.85rem; background-color: #dc3545;" onclick="removerProduto(${index})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(linha);
    });

    if (!temDados) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #999; padding: 20px;">Nenhum produto cadastrado.</td></tr>`;
    }

    const busca = document.getElementById("buscaProduto");
    if (busca && !busca.dataset.configurado) {
        busca.dataset.configurado = "true";
        busca.addEventListener("input", (e) => renderizarTabelaProdutos(e.target.value));
    }
}

// ==========================================================================
// SALVAR PRODUTO NO LOCALSTORAGE (MANTENDO AS DUAS COLUNAS DO BANCO)
// ==========================================================================
function configurarFormulario() {
    const form = document.getElementById("formCadastroProduto");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nome = document.getElementById("prodNome").value.trim();
        const descricao = document.getElementById("prodDescricao").value.trim();

        const produtos = JSON.parse(localStorage.getItem("produtos")) || [];

        // Estrutura do objeto correspondendo estritamente ao banco de dados SQL
        const novoProduto = {
            id: Math.floor(1000 + Math.random() * 9000), // Gerador de ID provisório (Simula AUTO_INCREMENT)
            nome: nome,
            descricao: descricao,
            idStatus: 1,  // Status inicial padrão (A ser gerenciado posteriormente no Estoque)
            idUsuario: 1  // ID do usuário logado fixo
        };

        produtos.push(novoProduto);
        localStorage.setItem("produtos", JSON.stringify(produtos));

        document.getElementById("modalCadastro").classList.remove("ativo");
        renderizarTabelaProdutos();
        alert("Produto cadastrado com sucesso!");
    });
}

// ==========================================================================
// AÇÕES AUXILIARES
// ==========================================================================
function removerProduto(index) {
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    if (confirm(`Deseja realmente remover o produto "${produtos[index].nome}"?`)) {
        produtos.splice(index, 1);
        localStorage.setItem("produtos", JSON.stringify(produtos));
        renderizarTabelaProdutos();
    }
}

function editarProduto(index) {
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    alert(`Editar selecionado para: ${produtos[index].nome} (Funcionalidade que será conectada ao banco de dados futuramente)`);
}

function configurarNavegacaoLateral() {
    const itensMenu = document.querySelectorAll("aside ul li");
    itensMenu.forEach(item => {
        item.addEventListener("click", () => {
            const modulo = item.textContent.trim().toLowerCase();
            if (modulo.includes("produtos")) window.location.href = "produtos.html";
            else if (modulo.includes("início") || modulo.includes("inicio")) window.location.href = "telaInicial.html";
            else if (modulo.includes("estoque")) window.location.href = "estoque.html";
        });
    });
}