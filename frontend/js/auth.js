// ==========================================================
// GUARDA DE ACESSO
// Inclua este script em toda página que exige login.
// Para páginas só de Administrador, ANTES deste script, defina:
//   <script>const PAGINA_REQUER_ADMIN = true;</script>
// ==========================================================

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