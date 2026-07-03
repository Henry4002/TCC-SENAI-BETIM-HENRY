document.addEventListener("DOMContentLoaded", () => {
    const nomePerfil = document.querySelector(".perfil span");
    if (nomePerfil) {
        nomePerfil.textContent = "Leandro";
    }

    // Inicializa o motor de cálculo dinâmico da Home
    carregarMetricasDinamicas();
    configurarNavegacaoLateral();
});

function carregarMetricasDinamicas() {
    let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    let totalProdutos = produtos.length;
    let totalEstoqueBaixo = 0;

    // Mapa para somar o saldo acumulado total de cada produto para verificar estoque mínimo geral
    let agrupadoPorNome = {};
    let minimosPorNome = {};

    produtos.forEach(prod => {
        const nome = prod.nome;
        const atual = parseInt(prod.atual || 0);
        const minimo = parseInt(prod.minimo || 0);

        agrupadoPorNome[nome] = (agrupadoPorNome[nome] || 0) + atual;
        minimosPorNome[nome] = minimo; // mantém a referência do mínimo configurado
    });

    // Calcula quantos produtos no total consolidado estão abaixo do mínimo
    for (let nome in agrupadoPorNome) {
        if (agrupadoPorNome[nome] < minimosPorNome[nome]) {
            totalEstoqueBaixo++;
        }
    }

    // Alimenta os seletores das suas divs mantendo os IDs definidos
    const txtProdutos = document.getElementById("numProdutos");
    const txtVersoes = document.getElementById("numVersoes");
    const txtReceitas = document.getElementById("numReceitas");
    const txtEstoqueBaixo = document.getElementById("numEstoqueBaixo");

    if (txtProdutos) txtProdutos.textContent = totalProdutos;
    
    // Contagem de lotes criados (Versões Cadastradas)
    if (txtVersoes) txtVersoes.textContent = totalProdutos; 
    
    // Simulação estável baseada nas categorias ou número de receitas bases distintas
    if (txtReceitas) txtReceitas.textContent = Object.keys(agrupadoPorNome).length; 
    
    if (txtEstoqueBaixo) {
        txtEstoqueBaixo.textContent = totalEstoqueBaixo;

        // Regra de borda dinâmica direta via JS para o card de estoque baixo
        const cardEstoque = txtEstoqueBaixo.closest('.cardEstatistica');
        if (cardEstoque) {
            if (totalEstoqueBaixo > 0) {
                cardEstoque.style.borderLeft = "5px solid #cc0000"; // Vermelho Crítico se houver problemas
            } else {
                cardEstoque.style.borderLeft = "5px solid #ffcc00"; // Amarelo Padrão de Atenção
            }
        }
    }
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