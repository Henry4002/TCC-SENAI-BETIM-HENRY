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
// RENDERIZAR TABELA E CARDS DE SALDO TOTAL CONSOLIDADO
// ==========================================================================
function renderizarTabelaEstoque(filtro = "") {
    const tbody = document.getElementById("tabelaEstoqueBody");
    const containerCards = document.getElementById("cardsConsolidados");
    if (!tbody) return;

    let estoque = JSON.parse(localStorage.getItem("estoque")) || [];
    tbody.innerHTML = "";

    // Dicionário para agrupar e somar os totais de cada produto
    let totaisPorProduto = {};

    // Data de referência estável (Configurada para o ano corrente: 2026)
    const agora = new Date();
    const hojeAno = agora.getFullYear();
    const hojeMes = agora.getMonth() + 1;
    const hojeDia = agora.getDate();
    const hojeChaveNumerica = (hojeAno * 10000) + (hojeMes * 100) + hojeDia;

    let temDados = false;
    let houveModificacao = false;

    estoque.forEach((item, index) => {
        if (!item || !item.id || !item.nomeProduto) return;

        // Sanitização automática de dados antigos/testes retroativos
        const regexFormatacao = /^\d{4}-\d{2}-\d{2}$/;
        if (item.data_validade && !regexFormatacao.test(item.data_validade)) {
            item.data_validade = "2026-12-31";
            houveModificacao = true;
        }
        if (item.data_fabricacao && !regexFormatacao.test(item.data_fabricacao)) {
            item.data_fabricacao = "2026-01-01";
            houveModificacao = true;
        }

        // --- REGRA DE SOMA TOTAL CONSOLIDADA ---
        // Se o produto já foi mapeado, soma a quantidade do lote atual, senão inicializa
        const nomeProd = item.nomeProduto;
        const qtdLote = parseInt(item.quantidade || 0);
        if (totaisPorProduto[nomeProd]) {
            totaisPorProduto[nomeProd] += qtdLote;
        } else {
            totaisPorProduto[nomeProd] = qtdLote;
        }
        // ----------------------------------------

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

        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td><strong>#${item.id}</strong></td>
            <td>${item.nomeProduto}</td>
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

    // --- RENDERIZAR OS CARDS DOS PRODUTOS SOMADOS ---
    if (containerCards) {
        containerCards.innerHTML = "";
        const produtosUnicos = Object.keys(totaisPorProduto);

        if (produtosUnicos.length === 0) {
            containerCards.innerHTML = `<p style="color: #888; font-style: italic;">Nenhum acumulado disponível.</p>`;
        } else {
            produtosUnicos.forEach(nomeProd => {
                const totalQtd = totaisPorProduto[nomeProd];
                
                const card = document.createElement("div");
                card.style.cssText = `
                    background-color: #fff;
                    border: 1px solid #e0e0e0;
                    border-left: 5px solid #DE9E52;
                    border-radius: 8px;
                    padding: 12px 20px;
                    min-width: 180px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
                `;
                card.innerHTML = `
                    <div style="font-size: 0.85rem; color: #666; font-weight: bold; text-transform: uppercase;">${nomeProd}</div>
                    <div style="font-size: 1.6rem; font-weight: bold; color: #333; margin-top: 4px;">${totalQtd} <span style="font-size: 0.9rem; font-weight: normal; color: #888;">un total</span></div>
                `;
                containerCards.appendChild(card);
            });
        }
    }
    // ------------------------------------------------

    if (houveModificacao) {
        localStorage.setItem("estoque", JSON.stringify(estoque));
    }

    if (!temDados) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#999; padding:20px;">Nenhum item cadastrado no estoque.</td></tr>`;
    }
}

// ==========================================================================
// LIMITADORES VISUAIS NOS CAMPOS INPUT DATA
// ==========================================================================
function configurarRestricoesDeDatas() {
    const inputFab = document.getElementById("movFab");
    const inputVal = document.getElementById("movVal");

    if (!inputFab || !inputVal) return;

    // Define que a validade mínima é a data de fabricação selecionada
    inputFab.addEventListener("change", () => {
        if (inputFab.value) {
            inputVal.min = inputFab.value;
        }
    });

    // Corta fisicamente se o usuário tentar digitar um ano com mais de 4 dígitos
    [inputFab, inputVal].forEach(input => {
        input.addEventListener("input", () => {
            const valor = input.value; 
            if (valor && valor.includes("-")) {
                const ano = valor.split("-")[0];
                if (ano.length > 4) {
                    const anoCortado = ano.substring(0, 4);
                    const resto = valor.substring(ano.length);
                    input.value = anoCortado + resto;
                }
            }
        });
    });
}

// ==========================================================================
// PROCESSAMENTO DO FORMULÁRIO COM VALIDAÇÃO IMPEDITIVA CRÍTICA
// ==========================================================================
function configurarFormularioEstoque() {
    const form = document.getElementById("formMovimentacao");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        let estoque = JSON.parse(localStorage.getItem("estoque")) || [];
        const select = document.getElementById("movProduto");
        const editIndex = document.getElementById("editIndex").value;
        
        const dataFab = document.getElementById("movFab").value;
        const dataVal = document.getElementById("movVal").value;

        // Regex para verificar os 4 dígitos
        const regexDataValida = /^\d{4}-\d{2}-\d{2}$/;
        if (!regexDataValida.test(dataFab) || !regexDataValida.test(dataVal)) {
            alert("Por favor, preencha as datas completamente utilizando anos de 4 dígitos (Ex: 2026)!");
            return;
        }

        const partesFab = dataFab.split("-");
        const partesVal = dataVal.split("-");

        const anoFab = parseInt(partesFab[0]);
        const anoVal = parseInt(partesVal[0]);

        // Trava de segurança contra digitação de anos passados sem sentido comercial
        if (anoFab < 2020 || anoVal < 2020) {
            alert("Operação Bloqueada: O sistema não aceita registros com anos retroativos anteriores a 2020!");
            return;
        }

        // Validação matemática: Validade menor que a fabricação
        const numFab = (anoFab * 10000) + (parseInt(partesFab[1]) * 100) + parseInt(partesFab[2]);
        const numVal = (anoVal * 10000) + (parseInt(partesVal[1]) * 100) + parseInt(partesVal[2]);

        if (numVal < numFab) {
            alert("Erro de Consistência: A data de validade não pode ser inferior à data de fabricação!");
            return;
        }

        const idProduto = select.value;
        const nomeProduto = select.options[select.selectedIndex].getAttribute("data-nome");
        const qtdMinima = parseInt(document.getElementById("movQtdMinima").value);
        const quantidade = parseInt(document.getElementById("movQuantidade").value);

        let idLote = (editIndex !== "") ? estoque[editIndex].id : Math.floor(1000 + Math.random() * 9000);
        let dataCriacaoOriginal = (editIndex !== "") ? estoque[editIndex].data_atualizacao : new Date().toISOString();

        const registroEstoque = {
            id: idLote,
            data_atualizacao: dataCriacaoOriginal,
            qtd_minima: qtdMinima,
            quantidade: quantidade,
            idProduto: idProduto,
            nomeProduto: nomeProduto,
            data_fabricacao: dataFab,
            data_validade: dataVal
        };

        if (editIndex !== "") {
            estoque[editIndex] = registroEstoque;
        } else {
            estoque.push(registroEstoque);
        }

        localStorage.setItem("estoque", JSON.stringify(estoque));
        document.getElementById("modalMovimentacao").classList.remove("ativo");
        document.getElementById("editIndex").value = "";
        
        renderizarTabelaEstoque();
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
    const btnMovimentar = document.getElementById("btnMovimentar");
    const btnFechar = document.getElementById("btnFecharMov");

    if (!modal || !btnMovimentar || !btnFechar) return;

    btnMovimentar.addEventListener("click", () => {
        document.getElementById("editIndex").value = ""; 
        document.getElementById("modalMovTitulo").textContent = "Atualizar Dados de Estoque";
        document.getElementById("formMovimentacao").reset();
        document.getElementById("movProduto").disabled = false; 
        document.getElementById("movVal").min = "";
        carregarSelectProdutos();
        modal.classList.add("ativo");
    });

    btnFechar.addEventListener("click", () => modal.classList.remove("ativo"));
}

window.editarEstoque = function(index) {
    let estoque = JSON.parse(localStorage.getItem("estoque")) || [];
    const item = estoque[index];
    if (!item) return;

    document.getElementById("editIndex").value = index;
    document.getElementById("modalMovTitulo").textContent = "Editar Registro de Estoque";
    
    document.getElementById("movQtdMinima").value = item.qtd_minima;
    document.getElementById("movQuantidade").value = item.quantidade;
    document.getElementById("movFab").value = item.data_fabricacao;
    document.getElementById("movVal").value = item.data_validade;
    document.getElementById("movVal").min = item.data_fabricacao;

    carregarSelectProdutos(item.idProduto);
    document.getElementById("movProduto").disabled = true; 

    document.getElementById("modalMovimentacao").classList.add("ativo");
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