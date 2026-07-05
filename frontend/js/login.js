// Seleção dos elementos
const API_URL = "https://projeto-tcc-senai-production.up.railway.app"

const formLogin = document.getElementById("formLogin");

const gmail = document.getElementById("gmail"); 
const senha = document.getElementById("senha");

const erroGmail = document.getElementById("erroGmail"); 
const erroSenha = document.getElementById("erroSenha");

const toggleSenha = document.getElementById("toggleSenha");
const botao = document.querySelector("button");
const esqueciSenha = document.querySelector(".esqueciSenha"); // ADICIONADO: Seleção do link esqueci senha


// Funções auxiliares
function limparErros() {
    erroGmail.style.display = "none"; 
    erroSenha.style.display = "none";

    gmail.parentElement.classList.remove("erroCampo", "sucesso"); 
    senha.parentElement.classList.remove("erroCampo", "sucesso");
}

function mostrarErro(elementoMensagem, input, texto) {
    elementoMensagem.style.display = "block";
    elementoMensagem.textContent = texto;

    input.parentElement.classList.remove("sucesso");
    input.parentElement.classList.add("erroCampo");
}

function mostrarSucesso(input) {
    input.parentElement.classList.remove("erroCampo");
    input.parentElement.classList.add("sucesso");
}


// Mostrar/Ocultar senha
toggleSenha.addEventListener("click", () => {
    if (senha.type === "password") {
        senha.type = "text";
        toggleSenha.classList.remove("fa-eye");
        toggleSenha.classList.add("fa-eye-slash");
    } else {
        senha.type = "password";
        toggleSenha.classList.remove("fa-eye-slash");
        toggleSenha.classList.add("fa-eye");
    }
});


// Função para validar formato de e-mail/gmail
function validarFormatoGmail(valor) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(valor);
}

// Validação em tempo real do Gmail
gmail.addEventListener("input", () => {
    const valor = gmail.value.trim();

    if (valor.length === 0) {
        erroGmail.style.display = "none";
        gmail.parentElement.classList.remove("erroCampo", "sucesso");
    } else if (!validarFormatoGmail(valor)) {
        mostrarErro(
            erroGmail,
            gmail,
            "Por favor, insira um Gmail válido."
        );
    } else {
        erroGmail.style.display = "none";
        mostrarSucesso(gmail);
    }
});

// Validação da senha
senha.addEventListener("input", () => {
    if (senha.value.trim().length === 0) {
        erroSenha.style.display = "none";
        senha.parentElement.classList.remove("erroCampo", "sucesso");
    } else {
        erroSenha.style.display = "none";
        senha.parentElement.classList.remove("erroCampo");
    }
});


// ==========================================================================
// LÓGICA DA RECUPERAÇÃO DE SENHA (NOVA FUNCIONALIDADE)
// ==========================================================================
esqueciSenha.addEventListener("click", (event) => {
    event.preventDefault(); // Impede a página de recarregar ou subir pro topo
    limparErros();

    const valorGmail = gmail.value.trim();

    // Se o campo estiver vazio ou o formato for inválido, exige o preenchimento
    if (valorGmail.length === 0 || !validarFormatoGmail(valorGmail)) {
        mostrarErro(
            erroGmail,
            gmail,
            "Digite seu Gmail acima para receber as instruções de recuperação."
        );
        gmail.focus(); // Coloca o cursor do teclado direto no campo
        return;
    }

    // Se o e-mail for válido, simula o envio com sucesso
    mostrarSucesso(gmail);
    alert(`Sucesso! Um link de redefinição de senha foi enviado para o endereço: ${valorGmail}`);
});


// Envio do formulário
formLogin.addEventListener("submit", async function (event) {
    event.preventDefault();
    limparErros();

    let formularioValido = true;

    // Validação do Gmail no Submit
    if (!validarFormatoGmail(gmail.value.trim())) {
        mostrarErro(
            erroGmail,
            gmail,
            "Por favor, insira um Gmail válido."
        );
        formularioValido = false;
    }

    // Senha
    if (senha.value.trim() === "") {
    mostrarErro(
        erroSenha,
        senha,
        "Digite sua senha."
    );
    formularioValido = false;
}

    // Se houver erro, não continua
    if (!formularioValido) {
        return;
    }

    //Login
    
    botao.disabled = true;
    botao.textContent = "Entrando...";

    try{

        const resposta = await fetch(`${API_URL}/auth/login`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                email: gmail.value.trim(),
                senha: senha.value.trim()
            })
        });

        if(!resposta.ok){

            const erro = await resposta.json();

            mostrarErro(
                erroSenha,
                senha,
                erro.message || "E-mail ou senha inválidos."
            );

            botao.disabled = false;
            botao.textContent = "Entrar";
            return;
        }

        const usuario = await resposta.json();

        localStorage.setItem("Usuario", JSON.stringify(usuario));
        localStorage.setItem("logado", "true");

        window.location.href = "telainicial.html";

    }catch(e) {

        alert("Erro ao conectar com o servidor.");

        botao.disabled = false;
        botao.textContent = "Entrar";
    }

});