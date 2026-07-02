// ==========================================================================
// 1. CONTROLE DE ACESSO, SESSÃO E MENU MOBILE (PROTEÇÃO DA TELA)
// ==========================================================================
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

    // --- LOGICA DE ACESSIBILIDADE E CLIQUES DO MENU MOBILE ---
    const btnMenuMobile = document.getElementById("btnMenuMobile");
    const menuLateral = document.getElementById("menuLateral");

    if (btnMenuMobile && menuLateral) {
        btnMenuMobile.addEventListener("click", () => {
            // Alterna a classe que faz a gaveta deslizar no CSS
            const estaAberto = menuLateral.classList.toggle("aberto");
            
            // Atualiza os leitores de ecrã dinamicamente se está aberto ou fechado
            btnMenuMobile.setAttribute("aria-expanded", estaAberto);
            btnMenuMobile.setAttribute("aria-label", estaAberto ? "Fechar menu de navegação" : "Abrir menu de navegação");
        });
    }

    // Inicializa as funções da Tela Inicial
    carregarMetricasDinamicas();
    configurarNavegacaoLateral();
    configurarBotaoLogout();
});

// ==========================================================================
// 2. CARREGAMENTO DE MÉTRICAS E LÓGICA DO ESTOQUE CRÍTICO
// ==========================================================================
function carregarMetricasDinamicas() {
    // Busca os dados do localStorage (ou assume um array vazio [] se não existirem)
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    const versoes = JSON.parse(localStorage.getItem("versoes")) || [];
    const receitas = JSON.parse(localStorage.getItem("receitas")) || [];
    const estoque = JSON.parse(localStorage.getItem("estoque")) || []; 

    // Seleciona a tag <p> de dentro de cada um dos 4 cards de estatística
    const cards = document.querySelectorAll(".cardEstatistica p");
    
    // Alimenta os valores de forma direta e sem quebrar ou alterar cores do CSS
    if (cards.length >= 4) {
        cards[0].textContent = produtos.length;  // Total de Produtos
        cards[1].textContent = versoes.length;   // Total de Versões
        cards[2].textContent = receitas.length;  // Total de Receitas
        
        // Apenas calcula quantos itens estão abaixo do mínimo e joga o número no 4º card
        const itensCriticos = estoque.filter(item => {
            return item && typeof item.quantidade === 'number' && typeof item.minimo === 'number' 
                ? item.quantidade < item.minimo 
                : false;
        });
        
        cards[3].textContent = itensCriticos.length; // Exibe a quantidade de itens em falta (começa em 0)
    }
}

// ==========================================================================
// 3. INTERATIVIDADE DA BARRA LATERAL (MENU ACTIVE E ACESSIBILIDADE)
// ==========================================================================
function configurarNavegacaoLateral() {
    const itensMenu = document.querySelectorAll("aside ul li");

    itensMenu.forEach(item => {
        // Ação ao clicar com o rato
        item.addEventListener("click", () => processarCliqueMenu(item));
        
        // Ação ao pressionar Enter ou Espaço com o teclado focado (Tab)
        item.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault(); // Evita scroll do ecrã com a barra de espaço
                processarCliqueMenu(item);
            }
        });
    });
}

function processarCliqueMenu(itemClicado) {
    const modulo = itemClicado.textContent.trim().toLowerCase();
    console.log(`Navegando para o módulo: ${modulo}`);

    // Fecha a gaveta mobile se estiver aberta
    const menuLateral = document.getElementById("menuLateral");
    const btnMenuMobile = document.getElementById("btnMenuMobile");
    if (menuLateral && btnMenuMobile) {
        menuLateral.classList.remove("aberto");
        btnMenuMobile.setAttribute("aria-expanded", "false");
    }

    // Redirecionamento real
    if (modulo.includes("produtos")) {
        window.location.href = "produtos.html";
    } else if (modulo.includes("início") || modulo.includes("inicio")) {
        window.location.href = "telaInicial.html";
    }
    // Adiciona os outros links aqui futuramente (receitas, estoque, etc.)
}

// ==========================================================================
// 4. CONFIGURAÇÃO DO BOTÃO DE LOGOUT (DESLOGAR)
// ==========================================================================
function configurarBotaoLogout() {
    const btnLogout = document.getElementById("btnLogout");

    if (btnLogout) {
        btnLogout.addEventListener("click", function(event) {
            event.preventDefault();

            // Limpa o usuário da sessão 
            localStorage.removeItem("usuarioLogado");

            // Redireciona de volta para a tela de login
            window.location.href = "login.html";
        });
    }
}