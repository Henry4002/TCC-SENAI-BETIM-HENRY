// ==========================================================
// GUARDA DE ACESSO + DETECÇÃO DE CONTA EDITADA
// Inclua este script em toda página que exige login.
// Para páginas só de Administrador, ANTES deste script, defina:
//   <script>const PAGINA_REQUER_ADMIN = true;</script>
// ==========================================================

const API_URL_AUTH = "https://projeto-tcc-senai-production.up.railway.app";

(function verificarAcesso() {
    const logado = localStorage.getItem("logado");
    const usuarioSalvo = localStorage.getItem("usuario");

    if (logado !== "true" || !usuarioSalvo) {
        window.location.href = "login.html";
        return;
    }

    const usuario = JSON.parse(usuarioSalvo);

    if (typeof PAGINA_REQUER_ADMIN !== "undefined" && PAGINA_REQUER_ADMIN) {
        if (usuario.perfil !== "Administrador") {
            alert("Acesso restrito a administradores.");
            window.location.href = "telainicial.html";
        }
    }
})();

function expulsarUsuario(motivo) {
    localStorage.removeItem("usuario");
    localStorage.removeItem("logado");
    alert(motivo || "Sua sessão expirou. Faça login novamente.");
    window.location.href = "login.html";
}

async function verificarContaAtualizada() {
    const usuarioSalvo = localStorage.getItem("usuario");
    if (!usuarioSalvo) return;

    const usuario = JSON.parse(usuarioSalvo);

    try {
        const resposta = await fetch(`${API_URL_AUTH}/usuario/${usuario.id}`);
        if (!resposta.ok) return; // erro de rede não deve expulsar à toa

        const dadosAtuais = await resposta.json();

        if (usuario.atualizadoEm && dadosAtuais.atualizadoEm && usuario.atualizadoEm !== dadosAtuais.atualizadoEm) {
            expulsarUsuario("Sua conta foi atualizada. Faça login novamente.");
        }
    } catch (erro) {
        console.error("Erro ao verificar atualização da conta:", erro);
    }
}

setInterval(verificarContaAtualizada, 20000); // checa a cada 20s