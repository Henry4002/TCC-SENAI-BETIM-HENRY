
const API_URL = "https://projeto-tcc-senai-production.up.railway.app"

function formatarData(data){
    return new Date(data).toLocaleDateString("pt-BR")
}

async function carregarProdutos() {

    const resposta = await fetch(`${API_URL}/produtos`);

    const produtos = await resposta.json();

    document.getElementById("numProdutos").textContent = produtos.length;
}

async function carregarReceitas() {

    const resposta = await fetch(`${API_URL}/receita`);

    const receitas = await resposta.json();

    document.getElementById("numReceitas").textContent = receitas.length
    
}

async function carregarVersoesReceita() {

    const resposta = await fetch(`${API_URL}/versaoreceita`);

    const versoes = await resposta.json();

    document.getElementById("numVersoes").textContent = versoes.length
    
}

async function carregarEstoqueBaixo() {

    const resposta = await fetch(`${API_URL}/estoque`);

    const estoque = await resposta.json();

    const estoqueBaixo = estoque.filter(item => item.quantidade <= item.qtdMinima);

    document.getElementById("numEstoqueBaixo").textContent = estoqueBaixo.length;
    
}

async function carregarUltimosLotes() {

    const resposta = await fetch(`${API_URL}/estoque`);

    const lotes = await resposta.json();

    const tabela = document.getElementById("tabelaUltimosLotes");

    tabela.innerHTML = "";

    const ultimos = lotes.slice(-5).reverse();

    ultimos.forEach(lote => {

        tabela.innerHTML += `
            <tr>
                <td>${lote.lote}</td>
                <td>${lote.produto}</td>
                <td>${lote.quantidade}</td>
                <td>${lote.dataFabricacao}</td>
                <td>${lote.dataValidade}</td>
        
        `;
    })
    
}
// ==========================================================================
// CONTROLADOR DA TELA INICIAL (DASHBOARD)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {

    carregarProdutos();
    carregarReceitas();
    carregarVersoesReceita();
    carregarEstoqueBaixo();
    carregarUltimosLotes();
    carregarMetricasDinamicas();

});

function carregarMetricasDinamicas() {
    // 1. Puxar as bases de dados locais atualizadas
    
    const estoque = JSON.parse(localStorage.getItem('estoque_db')) || [];
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if(usuario) {
        document.getElementById("nomeUsuario").textContent = usuario.nome;
    }

    // 2. Conectar com os elementos HTML do Dashboard
    const txtProdutos = document.getElementById("numProdutos");
    const txtVersoes = document.getElementById("numVersoes");
    const txtReceitas = document.getElementById("numReceitas");
    const txtEstoqueBaixo = document.getElementById("numEstoqueBaixo");

    // 3. Aplicar as contagens reais
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