document.addEventListener("DOMContentLoaded", () => {
    const nomePerfil = document.querySelector(".perfil span");
    if (nomePerfil) nomePerfil.textContent = "Leandro";

    renderizarTabelaEstoque();
    inicializarModaisEstoque();
    configurarFormularioEstoque();
    configurarBuscaEstoque();
    configurarNavegacaoLateral();
});

function renderizarTabelaEstoque(filtro = "") {
    const tbody = document.getElementById("tabelaEstoqueBody");
    if (!tbody) return;

    let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    tbody.innerHTML = "";

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    let temDados = false;

    produtos.forEach((prod, idx) => {
        if (filtro && !prod.nome.toLowerCase().includes(filtro.toLowerCase()) && !prod.lote.toLowerCase().includes(filtro.toLowerCase())) {
            return;
        }
        temDados = true;

        const atual = parseInt(prod.atual || 0);
        const minimo = parseInt(prod.minimo || 0);
        let txtSituacao = "Estoque Ideal 🟢";
        let corEstilo = "background-color: #d4edda; color: #155724; font-weight:bold; padding:2px 6px; border-radius:4px;";

        // Verifica validade
        if (prod.validade) {
            const dtVal = new Date(prod.validade + "T00:00:00");
            dtVal.setHours(0,0,0,0);
            if (dtVal < hoje) {
                txtSituacao = "Vencido ⚠️";
                corEstilo = "background-color: #721c24; color: #fff; font-weight:bold; padding:2px 6px; border-radius:4px;";
            }
        }

        // Se a validade estiver ok, checa quantidade
        if (txtSituacao !== "Vencido ⚠️") {
            if (atual === 0) {
                txtSituacao = "Zeradão ❌";
                corEstilo = "background-color: #f8d7da; color: #721c24; font-weight:bold; padding:2px 6px; border-radius:4px;";
            } else if (atual < minimo) {
                txtSituacao = "Crítico 🔴";
                corEstilo = "background-color: #ffdddd; color: #cc0000; font-weight:bold; padding:2px 6px; border-radius:4px;";
            }
        }

        const dtValidadeFormatada = prod.validade ? prod.validade.split("-").reverse().join("/") : "---";

        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td><strong>#${prod.id}</strong><br><small style="color:#777;">${prod.lote || 'Sem Lote'}</small></td>
            <td>${prod.nome}</td>
            <td>${minimo} un</td>
            <td><strong>${atual} un</strong></td>
            <td>${dtValidadeFormatada}</td>
            <td><span style="${corEstilo}">${txtSituacao}</span></td>
        `;
        tbody.appendChild(linha);
    });

    if (!temDados) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#999; padding:20px;">Nenhum registro de estoque correspondente.</td></tr>`;
    }
}

function inicializarModaisEstoque() {
    const modal = document.getElementById("modalMovimentacao");
    const btnEntrada = document.getElementById("btnEntrada");
    const btnSaida = document.getElementById("btnSaida");
    const btnFechar = document.getElementById("btnFecharMov");
    const selectProdutos = document.getElementById("movProduto");
    const camposEntrada = document.getElementById("camposExclusivosEntrada");
    const lblSelect = document.getElementById("lblSelectProduto");

    if (!modal || !btnEntrada || !btnSaida || !btnFechar) return;

    btnEntrada.addEventListener("click", () => {
        document.getElementById("movTipo").value = "ENTRADA";
        document.getElementById("modalMovTitulo").textContent = "Entrada de Lote (Nova Fornada)";
        lblSelect.textContent = "Qual é o Produto?";
        camposEntrada.style.display = "block";
        
        // Alimenta combo com produtos cadastrados
        let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
        selectProdutos.innerHTML = '<option value="" disabled selected>Selecione o produto...</option>';
        produtos.forEach((p, idx) => {
            selectProdutos.innerHTML += `<option value="${idx}">${p.nome}</option>`;
        });

        document.getElementById("formMovimentacao").reset();
        document.getElementById("movTipo").value = "ENTRADA";
        modal.classList.add("ativo");
    });

    btnSaida.addEventListener("click", () => {
        document.getElementById("movTipo").value = "SAIDA";
        document.getElementById("modalMovTitulo").textContent = "Registrar Saída / Baixa do Estoque";
        lblSelect.textContent = "Selecione o Lote Ativo para Baixar";
        camposEntrada.style.display = "none";

        let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
        selectProdutos.innerHTML = '<option value="" disabled selected>Selecione o lote...</option>';
        produtos.forEach((p, idx) => {
            selectProdutos.innerHTML += `<option value="${idx}">${p.nome} (Lote: ${p.lote} | Saldo: ${p.atual} un)</option>`;
        });

        document.getElementById("formMovimentacao").reset();
        document.getElementById("movTipo").value = "SAIDA";
        modal.classList.add("ativo");
    });

    btnFechar.addEventListener("click", () => modal.classList.remove("ativo"));
}

function configurarFormularioEstoque() {
    const form = document.getElementById("formMovimentacao");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
        
        const tipo = document.getElementById("movTipo").value;
        const idx = document.getElementById("movProduto").value;
        const qtd = parseInt(document.getElementById("movQuantidade").value || 0);

        if (idx === "") return;

        if (tipo === "ENTRADA") {
            const loteNome = document.getElementById("movLoteNome").value || "LT-GENERIC";
            const fab = document.getElementById("movFab").value;
            const val = document.getElementById("movVal").value;

            // CRIA UM NOVO REGISTRO/LOTE NO SISTEMA
            const novoLote = {
                id: Math.floor(100000 + Math.random() * 900000),
                nome: produtos[idx].nome,
                categoria: produtos[idx].categoria,
                minimo: produtos[idx].minimo,
                lote: loteNome,
                atual: qtd,
                fabricacao: fab,
                validade: val
            };
            produtos.push(novoLote);
            alert("Novo lote adicionado com sucesso!");
        } else {
            // SAÍDA/BAIXA
            if (parseInt(produtos[idx].atual || 0) < qtd) {
                alert(`Erro: Estoque insuficiente! Esse lote possui apenas ${produtos[idx].atual} unidades.`);
                return;
            }
            produtos[idx].atual = parseInt(produtos[idx].atual || 0) - qtd;
            alert("Baixa efetuada no lote!");
        }

        localStorage.setItem("produtos", JSON.stringify(produtos));
        document.getElementById("modalMovimentacao").classList.remove("ativo");
        renderizarTabelaEstoque();
    });
}

function configurarBuscaEstoque() {
    const input = document.getElementById("buscaEstoque");
    if (input) input.addEventListener("input", (e) => renderizarTabelaEstoque(e.target.value));
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