const API_URL = "https://projeto-tcc-senai-production.up.railway.app";

const ProdutoService = {
    listar: async () => {
        const res = await fetch(`${API_URL}/produtos`);
        if (!res.ok) throw new Error("Erro ao buscar produtos da API");
        return await res.json();
    },

    salvar: async (produto) => {
        const res = await fetch(`${API_URL}/produtos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(produto)
        });

        if (!res.ok) throw new Error("Erro ao salvar produto");
        return await res.json();
    },

    atualizar: async (id, produto) => {
        const res = await fetch(`${API_URL}/produtos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(produto)
        });

        if (!res.ok) throw new Error("Erro ao atualizar produto");
        return await res.json();
    },

    remover: async (id) => {
        const res = await fetch(`${API_URL}/produtos/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) throw new Error("Erro ao remover produto");
    }
};

function carregarUsuarioHeader() {
    try {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        const elemento = document.getElementById("nomeUsuario");

        // Só altera o texto se o elemento realmente existir na tela
        if (elemento) {
            elemento.textContent = usuario && usuario.nome ? usuario.nome : "Usuário";
        }
    } catch (err) {
        console.warn("Não foi possível carregar o usuário no header:", err);
    }
}

// Inicialização segura da página
document.addEventListener("DOMContentLoaded", () => {
    carregarUsuarioHeader();
    
    // Executa as duas funções de forma independente para que o erro de uma não trave a outra
    renderizarTabelaProdutos().catch(err => console.error("Erro na tabela:", err));
    inicializarModalProdutos();
});

async function renderizarTabelaProdutos() {
    const tbody = document.getElementById("tabelaProdutosBody");
    if (!tbody) return;

    try {
        const produtos = await ProdutoService.listar();
        tbody.innerHTML = "";

        if (!produtos || produtos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px; color:#666;">Nenhum produto encontrado no banco.</td></tr>`;
            return;
        }

        produtos.forEach(prod => {
            const tr = document.createElement("tr");

            // Tratamento seguro para valores nulos ou aspas
            const nomeStr = prod.nome ? String(prod.nome) : "";
            const descStr = prod.descricao ? String(prod.descricao) : "";
            const catStr = prod.categoria ? String(prod.categoria) : "";

            const nomeEscapado = nomeStr.replace(/"/g, '&quot;');
            const descEscapada = descStr.replace(/"/g, '&quot;');
            const catEscapada = catStr.replace(/"/g, '&quot;');

            tr.innerHTML = `
                <td>${nomeStr}</td>
                <td>${descStr}</td>
                <td>${catStr || '-'}</td>
                <td>
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <button onclick="abrirEdicaoProduto(${prod.id}, '${nomeEscapado}', '${descEscapada}', '${catEscapada}')" 
                                title="Editar produto"
                                style="cursor: pointer; background: none; border: none; color: #DE9E52; font-size: 1.1rem; padding: 4px;">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button onclick="removerProduto(${prod.id})" 
                                title="Excluir produto"
                                style="cursor: pointer; background: none; border: none; color: #c93b3b; font-size: 1.1rem; padding: 4px;">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Erro ao listar produtos:", error);
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px; color:#c93b3b; font-weight:bold;">Erro ao conectar com o servidor de produtos.</td></tr>`;
    }
}

function inicializarModalProdutos() {
    const modal = document.getElementById("modalCadastro");
    const form = document.getElementById("formCadastroProduto");
    const btnNovo = document.getElementById("btnNovoProduto");
    const btnFechar = document.getElementById("btnFecharModal");
    const tituloModal = modal?.querySelector("h2");
    
    if (!modal || !form) {
        console.error("Elementos da modal de cadastro não foram encontrados no HTML.");
        return;
    }

    // Abrir Modal de Criar
    if (btnNovo) {
        btnNovo.addEventListener("click", () => {
            form.reset();
            if (tituloModal) tituloModal.textContent = "Cadastrar Novo Produto";
            document.getElementById("prodNome").removeAttribute("data-edit-id");
            modal.classList.add("ativo");
        });
    }

    // Fechar Modal
    if (btnFechar) {
        btnFechar.addEventListener("click", () => {
            modal.classList.remove("ativo");
        });
    }

    // Salvar ou Atualizar Dados
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const inputNome = document.getElementById("prodNome");
        const editId = inputNome ? inputNome.getAttribute("data-edit-id") : null;

        // 1. Captura o usuário logado do localStorage
        const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
        
        if (!usuarioLogado || !usuarioLogado.id) {
            alert("Erro: Usuário não identificado. Por favor, faça login novamente.");
            window.location.href = "login.html";
            return;
        }

        // 2. Monta o objeto incluindo a referência do usuário
        const produto = {
            nome: inputNome ? inputNome.value : "",
            descricao: document.getElementById("prodDescricao")?.value || "",
            categoria: document.getElementById("prodCategoria")?.value || null,
            usuario: {
                id: usuarioLogado.id
            }
        };

        try {
            if (editId) {
                await ProdutoService.atualizar(editId, produto);
            } else {
                await ProdutoService.salvar(produto);
            }

            modal.classList.remove("ativo");
            form.reset();
            await renderizarTabelaProdutos();
        } catch (error) {
            alert(error.message);
        }
    });
}

// Funções Globais chamadas pelos botões da tabela
window.abrirEdicaoProduto = function(id, nome, descricao, categoria) {
    const modal = document.getElementById("modalCadastro");
    const tituloModal = modal?.querySelector("h2");
    
    if (tituloModal) tituloModal.textContent = "Editar Produto";
    
    if (document.getElementById("prodNome")) document.getElementById("prodNome").value = nome;
    if (document.getElementById("prodDescricao")) document.getElementById("prodDescricao").value = descricao;
    if (document.getElementById("prodCategoria")) document.getElementById("prodCategoria").value = categoria;
    
    if (document.getElementById("prodNome")) {
        document.getElementById("prodNome").setAttribute("data-edit-id", id);
    }
    if (modal) modal.classList.add("ativo");
}

window.removerProduto = async function (id) {
    if (confirm("Deseja excluir este produto?")) {
        try {
            await ProdutoService.remover(id);
            await renderizarTabelaProdutos();
        } catch (error) {
            alert(error.message);
        }
    }
};