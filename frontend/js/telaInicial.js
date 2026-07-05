// ==========================================================================
// CONTROLADOR DA TELA INICIAL (DASHBOARD)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    carregarMetricasDinamicas();
});

function carregarMetricasDinamicas() {
    // 1. Puxar as bases de dados locais atualizadas
    const produtos = JSON.parse(localStorage.getItem('produtos_db')) || [];
    const receitas = JSON.parse(localStorage.getItem('receitas')) || [];
    const versoes = JSON.parse(localStorage.getItem('versoes_receita')) || [];
    const estoque = JSON.parse(localStorage.getItem('estoque_db')) || [];

    // 2. Conectar com os elementos HTML do Dashboard
    const txtProdutos = document.getElementById("numProdutos");
    const txtVersoes = document.getElementById("numVersoes");
    const txtReceitas = document.getElementById("numReceitas");
    const txtEstoqueBaixo = document.getElementById("numEstoqueBaixo");

    // 3. Aplicar as contagens reais
    if (txtProdutos) txtProdutos.textContent = produtos.length;
    if (txtReceitas) txtReceitas.textContent = receitas.length;
    if (txtVersoes) txtVersoes.textContent = versoes.length;

    // 4. Lógica Inteligente para Estoque Baixo
    let totalEstoqueBaixo = 0;
    estoque.forEach(lote => {
        // Se a quantidade atual do lote for menor que a meta mínima, dispara o alerta
        if (lote.qtdAtual < lote.qtdMinima) {
            totalEstoqueBaixo++;
        }
    });

    if (txtEstoqueBaixo) {
        txtEstoqueBaixo.textContent = totalEstoqueBaixo;
        
        // Efeito visual automático: Se houver produtos em falta, o card fica com um aviso vermelho
        const cardEstoque = txtEstoqueBaixo.closest('.cardEstatistica');
        if (cardEstoque && totalEstoqueBaixo > 0) {
            cardEstoque.style.borderLeft = "5px solid #dc3545"; // Vermelho
            txtEstoqueBaixo.style.color = "#dc3545";
            txtEstoqueBaixo.style.fontWeight = "bold";
        } else if (cardEstoque) {
            cardEstoque.style.borderLeft = "5px solid #198754"; // Verde (Tudo OK)
            txtEstoqueBaixo.style.color = "#198754";
        }
    }
}