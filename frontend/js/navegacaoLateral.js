document.addEventListener("DOMContentLoaded", () => {
    configurarMenuLateralDinamico();
    aplicarEfeitoTransicao();
});

// 1. Injeta o HTML do menu e configura os ouvintes de clique
function configurarMenuLateralDinamico() {
    const asideMenu = document.getElementById("menuLateral");
    if (!asideMenu) return;

    // Injeta a lista padrão de módulos que todas as telas usam
    asideMenu.innerHTML = `
        <ul style="list-style: none; padding: 0; margin: 0;">
            <li data-url="telaInicial.html"><i class="fa-solid fa-chart-line"></i> Início</li>
            <li data-url="produtos.html"><i class="fa-solid fa-boxes-stacked"></i> Produtos</li>
            <li data-url="receitas.html"><i class="fa-solid fa-receipt"></i> Receitas</li>
            <li data-url="estoque.html"><i class="fa-solid fa-cubes-stacked"></i> Estoque</li>
            <li data-url="testes.html"><i class="fa-solid fa-vial"></i> Testes</li>
            <li data-url="ADMcadastro.html"><i class="fa-solid fa-user-plus"></i> Colaboradores</li>
        </ul>
    `;

    const itensMenu = asideMenu.querySelectorAll("ul li");
    const paginaAtual = window.location.pathname.split("/").pop();

    itensMenu.forEach(item => {
        const urlDestino = item.getAttribute("data-url");

        // Estilização base do item via JS para garantir o padrão visual
        item.style.padding = "15px 20px";
        item.style.display = "flex";
        item.style.alignItems = "center";
        item.style.gap = "12px";
        item.style.cursor = "pointer";
        item.style.transition = "0.2s";
        item.style.fontWeight = "500";

        // Destaca o item da página onde o usuário está
        if (paginaAtual === urlDestino) {
            item.style.backgroundColor = "#DE9E52";
            item.style.color = "#331E11";
            item.style.fontWeight = "bold";
        }

        if (!item.hasAttribute("tabindex")) {
            item.setAttribute("tabindex", "0");
            item.setAttribute("role", "button");
        }

        const executarNavegacao = (novaAba = false) => {
            if (urlDestino) {
                if (novaAba) window.open(urlDestino, "_blank");
                else window.location.href = urlDestino;
            }
        };

        // Efeito de Hover profissional
        item.addEventListener("mouseenter", () => {
            if (paginaAtual !== urlDestino) item.style.backgroundColor = "rgba(222, 158, 82, 0.15)";
        });
        item.addEventListener("mouseleave", () => {
            if (paginaAtual !== urlDestino) item.style.backgroundColor = "transparent";
        });

        // Ouvintes de clique
        item.addEventListener("mouseup", (e) => {
            if (e.button === 0) executarNavegacao(false);
            else if (e.button === 1) executarNavegacao(true);
        });

        item.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                executarNavegacao(false);
            }
        });
    });
}

// 2. Remove o "flicker" (piscar de ecrã) dando uma suavidade na entrada da página
function aplicarEfeitoTransicao() {
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.25s ease-in-out";
    
    // Força o navegador a renderizar antes de mostrar
    requestAnimationFrame(() => {
        document.body.style.opacity = "1";
    });
}