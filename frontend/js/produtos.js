document.addEventListener("DOMContentLoaded", () => {
    const nomePerfil = document.querySelector(".perfil span");
    if (nomePerfil) nomePerfil.textContent = "Leandro";

    carregarCategorias();
    inicializarModal();
    renderizarTabelaProdutos();
    configurarFormulario();
    configurarBotaoCategoria();
    configurarNavegacaoLateral();
});

function carregarCategorias() {
    const select = document.getElementById("prodCategoria");
    if (!select) return;
    let categorias = JSON.parse(localStorage.getItem("categorias")) || ["Panificação", "Confeitaria", "Salgados"];
    if (!localStorage.getItem("categorias")) {
        localStorage.setItem("categorias", JSON.stringify(categorias));
    }
    select.innerHTML = '<option value="" disabled selected>Selecione...</option>';
    categorias.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        select.appendChild(opt);
    });
}

function configurarBotaoCategoria() {
    const btn = document.getElementById("btnNovaCategoria");
    if (!btn) return;
    btn.addEventListener("click", () => {
        const novaCat = prompt("Digite o nome da nova categoria para o sistema:");
        if (!novaCat || novaCat.trim() === "") return;
        let categorias = JSON.parse(localStorage.getItem("categorias")) || [];
        if (categorias.map(c => c.toLowerCase()).includes(novaCat.trim().toLowerCase())) {
            alert("Esta categoria já existe!");
            return;
        }
        categorias.push(novaCat.trim());
        localStorage.setItem("categorias", JSON.stringify(categorias));
        carregarCategorias();
        document.getElementById("prodCategoria").value = novaCat.trim();
    });
}

function inicializarModal() {
    const modal = document.getElementById("modalCadastro");
    const btnAbrir = document.getElementById("btnAbrirModal"); 
    const btnFechar = document.getElementById("btnFecharModal");
    const form = document.getElementById("formProduto");

    if (!modal || !btnAbrir || !btnFechar) return;

    btnAbrir.addEventListener("click", () => {
        document.getElementById("modalTitulo").textContent = "Novo Produto Inteligente";
        document.getElementById("prodIndexEdicao").value = ""; // Limpa index de edição
        modal.classList.add("ativo");
        if (form) form.reset();
    });

    btnFechar.addEventListener("click", () => modal.classList.remove("ativo"));
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("ativo"); });
}

function renderizarTabelaProdutos() {
    const tabelaBody = document.getElementById("tabelaProdutosBody");
    if (!tabelaBody) return;

    let produtos = JSON.parse(localStorage.getItem("produtos")) || [
        { id: 1001, lote: "LT-PR-2026-01", nome: "Pão Francês", categoria: "Panificação", atual: 15, minimo: 50, fabricacao: "2026-06-30", validade: "2026-07-05" }
    ];

    if (!localStorage.getItem("produtos")) {
        localStorage.setItem("produtos", JSON.stringify(produtos));
    }

    tabelaBody.innerHTML = "";
    const hoje = new Date();

    produtos.forEach((prod, index) => {
        let txtEstoque = "";
        let corEstoque = "";
        const atual = parseInt(prod.atual || 0);
        const minimo = parseInt(prod.minimo || 1);

        if (atual < minimo) {
            txtEstoque = "Abaixo do Mínimo 🔴";
            corEstoque = "background-color: #ffdddd; color: #cc0000; font-weight: bold; border-radius: 4px; padding: 2px 6px; display: inline-block;";
        } else if (atual >= minimo && atual <= minimo * 1.2) {
            txtEstoque = "Perto do Mínimo 🟡";
            corEstoque = "background-color: #fff3cd; color: #856404; font-weight: bold; border-radius: 4px; padding: 2px 6px; display: inline-block;";
        } else {
            txtEstoque = "Estoque Ideal 🟢";
            corEstoque = "background-color: #d4edda; color: #155724; font-weight: bold; border-radius: 4px; padding: 2px 6px; display: inline-block;";
        }

        const dataValidade = new Date(prod.validade + "T00:00:00");
        const diffTempo = dataValidade - hoje;
        const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24));

        let txtValidade = "";
        let corValidade = "";
        const dtValidadeFormatada = prod.validade ? prod.validade.split("-").reverse().join("/") : "---";

        if (diffDias < 0) {
            txtValidade = "VENCIDO ❌";
            corValidade = "background-color: #f8d7da; color: #721c24; padding: 3px; border-radius: 4px; display: block; font-size: 0.8rem; text-align: center; font-weight: bold; margin-top: 4px;";
        } else if (diffDias >= 0 && diffDias <= 3) {
            txtValidade = "Alerta (Vence Breve) ⚠️";
            corValidade = "background-color: #fff3cd; color: #856404; padding: 3px; border-radius: 4px; display: block; font-size: 0.8rem; text-align: center; font-weight: bold; margin-top: 4px;";
        } else {
            txtValidade = "Dentro da Validade ✅";
            corValidade = "background-color: #d4edda; color: #155724; padding: 3px; border-radius: 4px; display: block; font-size: 0.8rem; text-align: center; margin-top: 4px;";
        }

        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td><strong>#${prod.id}</strong><br><small style="color:#777;">${prod.lote}</small></td>
            <td>${prod.nome}</td>
            <td><span style="background: #eee; padding: 3px 8px; border-radius: 12px; font-size: 0.85rem;">${prod.categoria}</span></td>
            <td><strong>${atual} un</strong><br><small style="color: #666;">Mín: ${minimo} un</small></td>
            <td><span style="${corEstoque}">${txtEstoque}</span></td>
            <td>
                <strong>${dtValidadeFormatada}</strong>
                <span style="${corValidade}">${txtValidade}</span>
            </td>
            <td>
                <button class="btn-acao editar" title="Editar" onclick="editarProduto(${index})" style="background:none; border:none; color:#de9e52; cursor:pointer; font-size: 1.1rem; margin-right: 10px;">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn-acao excluir" title="Excluir" onclick="excluirProduto(${index})" style="background:none; border:none; color:#cc0000; cursor:pointer; font-size: 1.1rem;">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tabelaBody.appendChild(linha);
    });
}

// FUNÇÃO DE EDIÇÃO: Carrega os dados de volta para o modal
function editarProduto(index) {
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    const prod = produtos[index];
    if (!prod) return;

    document.getElementById("modalTitulo").textContent = "Editar Produto";
    document.getElementById("prodIndexEdicao").value = index; // Armazena a posição

    document.getElementById("prodNome").value = prod.nome;
    document.getElementById("prodLote").value = prod.lote;
    document.getElementById("prodCategoria").value = prod.categoria;
    document.getElementById("prodAtual").value = prod.atual;
    document.getElementById("prodMinimo").value = prod.minimo;
    document.getElementById("prodFabricacao").value = prod.fabricacao;
    document.getElementById("prodValidade").value = prod.validade;

    document.getElementById("modalCadastro").classList.add("ativo");
}

function configurarFormulario() {
    const form = document.getElementById("formProduto");
    const modal = document.getElementById("modalCadastro");

    if (!form || !modal) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
        const indexEdicao = document.getElementById("prodIndexEdicao").value;

        const dadosProduto = {
            nome: document.getElementById("prodNome").value.trim(),
            lote: document.getElementById("prodLote").value.trim(),
            categoria: document.getElementById("prodCategoria").value,
            atual: parseInt(document.getElementById("prodAtual").value),
            minimo: parseInt(document.getElementById("prodMinimo").value),
            fabricacao: document.getElementById("prodFabricacao").value,
            validade: document.getElementById("prodValidade").value
        };

        if (new Date(dadosProduto.validade) < new Date(dadosProduto.fabricacao)) {
            alert("Operação bloqueada: A data de validade não pode ser menor que a data de produção!");
            return;
        }

        if (indexEdicao !== "") {
            // Modo Edição: Mantém o ID original e atualiza o objeto existente
            dadosProduto.id = produtos[indexEdicao].id;
            produtos[indexEdicao] = dadosProduto;
        } else {
            // Modo Cadastro Novo
            dadosProduto.id = produtos.length > 0 ? produtos[produtos.length - 1].id + 1 : 1001;
            produtos.push(dadosProduto);
        }

        localStorage.setItem("produtos", JSON.stringify(produtos));
        modal.classList.remove("ativo");
        renderizarTabelaProdutos();
    });
}

function excluirProduto(index) {
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    if (confirm(`Remover "${produtos[index].nome}" permanentemente?`)) {
        produtos.splice(index, 1);
        localStorage.setItem("produtos", JSON.stringify(produtos));
        renderizarTabelaProdutos();
    }
}

function configurarNavegacaoLateral() {
    const itensMenu = document.querySelectorAll("aside ul li");
    itensMenu.forEach(item => {
        item.addEventListener("click", () => {
            const texto = item.innerText || item.textContent;
            const modulo = texto.trim().toLowerCase();
            if (modulo.includes("produtos")) window.location.href = "produtos.html";
            else if (modulo.includes("início") || modulo.includes("inicio")) window.location.href = "telaInicial.html";
        });
    });
}