const ProdutoService = {
    listar: async () => JSON.parse(localStorage.getItem('produtos_db')) || [],
    salvar: async (produto) => {
        let produtos = await ProdutoService.listar();
        if(produto.id) {
            const index = produtos.findIndex(p => p.id == produto.id);
            if(index !== -1) produtos[index] = produto;
        } else {
            produto.id = Date.now();
            produtos.push(produto);
        }
        localStorage.setItem('produtos_db', JSON.stringify(produtos));
    },
    remover: async (id) => {
        let produtos = await ProdutoService.listar();
        localStorage.setItem('produtos_db', JSON.stringify(produtos.filter(p => p.id != id)));
    }
};

document.addEventListener("DOMContentLoaded", () => {
    renderizarTabelaProdutos();
    inicializarModalProdutos();
});

async function renderizarTabelaProdutos() {
    const tbody = document.getElementById("tabelaProdutosBody");
    if (!tbody) return;
    const produtos = await ProdutoService.listar();
    tbody.innerHTML = "";

    if (produtos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:30px; color:#555;">Nenhum produto cadastrado.</td></tr>`;
        return;
    }

    produtos.forEach(prod => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="color: #331E11; font-weight: bold;">${prod.nome}</td>
            <td style="color: #444; line-height: 1.4;">${prod.descricao}</td>
            <td style="text-align: center; width: 120px;">
                <div class="grupo-acoes">
                    <button class="btn-acao editar" title="Editar" onclick="abrirEdicaoProduto(${prod.id}, '${prod.nome.replace(/'/g, "\\'")}', '${prod.descricao.replace(/'/g, "\\'")}')">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button class="btn-acao excluir" title="Excluir" onclick="removerProduto(${prod.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function inicializarModalProdutos() {
    const modal = document.getElementById("modalCadastro");
    const form = document.getElementById("formCadastroProduto");
    
    // Abrir Modal de Criar
    document.getElementById("btnNovoProduto").addEventListener("click", () => {
        form.reset();
        document.getElementById("prodNome").removeAttribute("data-edit-id");
        modal.classList.add("ativo");
    });

    // Fechar Modal
    document.getElementById("btnFecharModal").addEventListener("click", () => {
        modal.classList.remove("ativo");
    });

    // Salvar Dados
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const inputNome = document.getElementById("prodNome");
        const idEdit = inputNome.getAttribute("data-edit-id");
        
        await ProdutoService.salvar({
            id: idEdit ? parseInt(idEdit) : null,
            nome: inputNome.value,
            descricao: document.getElementById("prodDescricao").value
        });

        modal.classList.remove("ativo");
        renderizarTabelaProdutos();
    });
}

// Funções Globais chamadas pelos botões
window.abrirEdicaoProduto = function(id, nome, descricao) {
    document.getElementById("prodNome").value = nome;
    document.getElementById("prodDescricao").value = descricao;
    document.getElementById("prodNome").setAttribute("data-edit-id", id);
    document.getElementById("modalCadastro").classList.add("ativo");
}

window.removerProduto = async function(id) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
        await ProdutoService.remover(id);
        renderizarTabelaProdutos();
    }
}