// ======================================================
// ELEMENTOS
// ======================================================
const API_URL = "https://projeto-tcc-senai-production.up.railway.app";

const formCadastro = document.getElementById("formCadastro");

const nome = document.getElementById("nome");
const email = document.getElementById("email");
const usuario = document.getElementById("usuario");
const senha = document.getElementById("senha");
const confirmarSenha = document.getElementById("confirmarSenha");

const erroNome = document.getElementById("erroNome");
const erroEmail = document.getElementById("erroEmail");
const erroUsuario = document.getElementById("erroUsuario");
const erroSenha = document.getElementById("erroSenha");
const erroConfirmarSenha = document.getElementById("erroConfirmarSenha");
const erroTipoUsuario = document.getElementById("erroTipoUsuario");

const barraForca = document.getElementById("barraForca");
const textoForca = document.getElementById("textoForca");

const toggleSenha = document.getElementById("toggleSenha");
const toggleConfirmar = document.getElementById("toggleConfirmar");

const btnCadastrar = document.getElementById("btnCadastrar");

const tipoUsuario = document.getElementById("tipoUsuario");


// ======================================================
// FUNÇÕES AUXILIARES
// ======================================================

function limparErro(elemento){

    elemento.textContent = "";
    elemento.style.display = "none";

}

function mostrarErro(elemento,input,mensagem){

    elemento.textContent = mensagem;
    elemento.style.display = "block";

    input.parentElement.classList.remove("sucesso");
    input.parentElement.classList.add("erroCampo");

}

function mostrarSucesso(input){

    input.parentElement.classList.remove("erroCampo");
    input.parentElement.classList.add("sucesso");

}

function limparCampo(input){

    input.parentElement.classList.remove("erroCampo");
    input.parentElement.classList.remove("sucesso");

}


// ======================================================
// MOSTRAR / OCULTAR SENHA
// ======================================================

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

toggleConfirmar.addEventListener("click", () => {
    if (confirmarSenha.type === "password") {
        confirmarSenha.type = "text";
        toggleConfirmar.classList.remove("fa-eye");
        toggleConfirmar.classList.add("fa-eye-slash");
    } else {
        confirmarSenha.type = "password";
        toggleConfirmar.classList.remove("fa-eye-slash");
        toggleConfirmar.classList.add("fa-eye");
    }
});


// ======================================================
// VALIDAÇÃO NOME
// ======================================================

function validarNome(){

    limparErro(erroNome);

    const valor = nome.value.trim();

    if(valor==""){

        limparCampo(nome);

        return false;

    }

    if(valor.length<3){

        mostrarErro(
            erroNome,
            nome,
            "O nome deve possuir pelo menos 3 letras."
        );

        return false;

    }

    mostrarSucesso(nome);

    return true;

}


// ======================================================
// EMAIL
// ======================================================

function validarEmail(){

    limparErro(erroEmail);

    const valor = email.value.trim();

    if(valor==""){

        limparCampo(email);

        return false;

    }

    const regex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!regex.test(valor)){

        mostrarErro(
            erroEmail,
            email,
            "Digite um e-mail válido."
        );

        return false;

    }

    mostrarSucesso(email);

    return true;

}


// ======================================================
// USUÁRIO
// ======================================================

function validarUsuario(){

    limparErro(erroUsuario);

    const valor = usuario.value.trim();

    if(valor==""){

        limparCampo(usuario);

        return false;

    }

    if(valor.length<4){

        mostrarErro(
            erroUsuario,
            usuario,
            "O usuário deve possuir pelo menos 4 caracteres."
        );

        return false;

    }

    if(valor.length>20){

        mostrarErro(
            erroUsuario,
            usuario,
            "Máximo de 20 caracteres."
        );

        return false;

    }

    mostrarSucesso(usuario);

    return true;

}


// ======================================================
// SENHA
// ======================================================

function validarSenha(){

    limparErro(erroSenha);

    const valor = senha.value;

    if(valor==""){

        limparCampo(senha);

        barraForca.style.width="0%";
        textoForca.textContent="";

        return false;

    }

    let forca=0;

    if(valor.length>=8)forca++;

    if(/[A-Z]/.test(valor))forca++;

    if(/[0-9]/.test(valor))forca++;

    if(/[^A-Za-z0-9]/.test(valor))forca++;

    switch(forca){

        case 1:

            barraForca.style.width="25%";
            barraForca.style.background="#dc3545";
            textoForca.textContent="Senha fraca";

            break;

        case 2:

            barraForca.style.width="50%";
            barraForca.style.background="#ffc107";
            textoForca.textContent="Senha média";

            break;

        case 3:

            barraForca.style.width="75%";
            barraForca.style.background="#0dcaf0";
            textoForca.textContent="Senha boa";

            break;

        case 4:

            barraForca.style.width="100%";
            barraForca.style.background="#198754";
            textoForca.textContent="Senha forte";

            break;

    }

    if(valor.length<8){

        mostrarErro(
            erroSenha,
            senha,
            "A senha deve possuir pelo menos 8 caracteres."
        );

        return false;

    }

    if(!/[A-Z]/.test(valor)){

        mostrarErro(
            erroSenha,
            senha,
            "Inclua uma letra maiúscula."
        );

        return false;

    }

    if(!/[0-9]/.test(valor)){

        mostrarErro(
            erroSenha,
            senha,
            "Inclua um número."
        );

        return false;

    }

    mostrarSucesso(senha);

    return true;

}


// ======================================================
// CONFIRMAR SENHA
// ======================================================

function validarConfirmarSenha(){

    limparErro(erroConfirmarSenha);

    if(confirmarSenha.value==""){

        limparCampo(confirmarSenha);

        return false;

    }

    if(confirmarSenha.value!==senha.value){

        mostrarErro(
            erroConfirmarSenha,
            confirmarSenha,
            "As senhas não coincidem."
        );

        return false;

    }

    mostrarSucesso(confirmarSenha);

    return true;

}


// ======================================================
// TIPO DE USUÁRIO
// ======================================================

function validarTipoUsuario() {
    if (tipoUsuario.value === "") {
        mostrarErro(
            erroTipoUsuario,
            tipoUsuario,
            "Selecione um perfil de acesso válido."
        );
        return false;
    }
    mostrarSucesso(tipoUsuario);
    return true;
}


// ======================================================
// EVENTOS
// ======================================================

nome.addEventListener("input",validarNome);

email.addEventListener("input",validarEmail);

usuario.addEventListener("input",validarUsuario);

senha.addEventListener("input",()=>{

    validarSenha();

    validarConfirmarSenha();

});

confirmarSenha.addEventListener("input",validarConfirmarSenha);


// ======================================================
// SUBMIT (CONECTADO NA API)
// ======================================================
formCadastro.addEventListener("submit", async (event) => {
    event.preventDefault();

    const valido =
        validarNome() &&
        validarEmail() &&
        validarUsuario() &&
        validarSenha() &&
        validarConfirmarSenha() &&
        validarTipoUsuario();

    if (!valido) return;

    // Monta o objeto com os dados que vão para o servidor
    const dadosUsuario = {
        nome: nome.value.trim(),
        email: email.value.trim(),
        usuario: usuario.value.trim(),
        senha: senha.value,
        tipoUsuario: document.querySelector('input[name="tipoUsuario"]:checked').value
    };

    // Desativa o botão enquanto carrega para o usuário não clicar 2 vezes
    btnCadastrar.disabled = true;
    btnCadastrar.textContent = "Processando...";

    try {
        if (usuarioEmEdicao !== null) {
            // MODO EDIÇÃO: Envia um PUT para a API atualizar o usuário (usando o ID)
            const resposta = await fetch(`${API_URL}/usuarios/${usuarioEmEdicao}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosUsuario)
            });

            if (!resposta.ok) throw new Error("Erro ao atualizar o colaborador.");

            alert("Colaborador atualizado com sucesso!");
            usuarioEmEdicao = null; // Limpa o estado de edição
            btnCadastrar.textContent = "Cadastrar Colaborador";
            
        } else {
            // MODO CRIAÇÃO: Envia um POST para a API salvar o novo usuário
            const resposta = await fetch(`${API_URL}/usuarios`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosUsuario)
            });

            if (!resposta.ok) {
                const erro = await resposta.json();
                // A API pode retornar erro se o usuário já existir, mostramos isso:
                throw new Error(erro.message || "Erro ao cadastrar. Verifique se o usuário já existe.");
            }

            alert("Colaborador cadastrado com sucesso!");
        }

        formCadastro.reset();
        listarUsuarios(); // Puxa a lista nova do banco de dados

    } catch (erro) {
        alert(erro.message); // Mostra o erro na tela
    } finally {
        // Devolve o botão ao normal
        btnCadastrar.disabled = false;
        if(usuarioEmEdicao === null) btnCadastrar.textContent = "Cadastrar Colaborador";
    }
});

document.addEventListener("DOMContentLoaded", listarUsuarios);

// ==========================================================
// MOTOR DA BARRA DE FORÇA DE SENHA
// ==========================================================
const inputSenhaForca = document.getElementById('senha');
const barraDeForca = document.getElementById('barraForca');
const textoDeForca = document.getElementById('textoForca');

if (inputSenhaForca && barraDeForca) {
    inputSenhaForca.addEventListener('input', function() {
        const valor = this.value;
        let forca = 0;

        // Regras de força (cada uma vale 25%)
        if (valor.length >= 8) forca += 25; // Tamanho
        if (/[A-Z]/.test(valor)) forca += 25; // Letra Maiúscula
        if (/[0-9]/.test(valor)) forca += 25; // Número
        if (/[^A-Za-z0-9]/.test(valor)) forca += 25; // Símbolo Especial

        // Atualiza a largura da barra
        barraDeForca.style.width = forca + '%';

        // Altera a cor e o texto baseado na pontuação
        if (valor.length === 0) {
            barraDeForca.style.width = '0%';
            textoDeForca.textContent = '';
        } else if (forca <= 25) {
            barraDeForca.style.backgroundColor = '#ff4d4d'; // Vermelho
            textoDeForca.textContent = 'Senha Fraca';
            textoDeForca.style.color = '#ff4d4d';
        } else if (forca <= 50) {
            barraDeForca.style.backgroundColor = '#ffa64d'; // Laranja
            textoDeForca.textContent = 'Senha Razoável';
            textoDeForca.style.color = '#ffa64d';
        } else if (forca <= 75) {
            barraDeForca.style.backgroundColor = '#DE9E52'; // Caramelo (Sua cor)
            textoDeForca.textContent = 'Senha Boa';
            textoDeForca.style.color = '#DE9E52';
        } else {
            barraDeForca.style.backgroundColor = '#28a745'; // Verde
            textoDeForca.textContent = 'Senha Forte';
            textoDeForca.style.color = '#28a745';
        }
    });
}

// ======================================================
// TABELA E AÇÕES (CONECTADAS NA API)
// ======================================================

// Função assíncrona para buscar os usuários na API
async function listarUsuarios() {
    const listaContainer = document.getElementById("listaUsuarios");
    if (!listaContainer) return;

    listaContainer.innerHTML = "<tr><td colspan='5' style='text-align:center;'>Carregando colaboradores...</td></tr>";

    try {
        const resposta = await fetch(`${API_URL}/usuarios`);
        if (!resposta.ok) throw new Error("Erro de comunicação com o servidor.");

        const usuarios = await resposta.json(); // Transforma a resposta da API em objeto JS
        
        if (usuarios.length === 0) {
            listaContainer.innerHTML = "<tr><td colspan='5' style='text-align:center;'>Nenhum colaborador cadastrado.</td></tr>";
            return;
        }

        listaContainer.innerHTML = "";
        usuarios.forEach((u) => {
            listaContainer.innerHTML += `
                <tr>
                    <td>${u.nome}</td>
                    <td>${u.email}</td>
                    <td>${u.usuario}</td>
                    <td>${u.tipoUsuario}</td>
                    <td>
                        <div class="grupo-acoes">
                            <button class="btn-acao editar" onclick="prepararEdicao('${u.id}')">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="btn-acao excluir" onclick="deletarUsuario('${u.id}')">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
    } catch (erro) {
        listaContainer.innerHTML = `<tr><td colspan='5' style='text-align:center; color:red;'>Falha ao carregar os dados.</td></tr>`;
        console.error(erro);
    }
}

// Quando clicar em EDITAR na tabela
window.prepararEdicao = async function(id) {
    try {
        // Busca os dados APENAS desse usuário lá no banco
        const resposta = await fetch(`${API_URL}/usuarios/${id}`);
        const u = await resposta.json();

        // Preenche os campos
        nome.value = u.nome;
        email.value = u.email;
        usuario.value = u.usuario;
        
        // (Geralmente a senha não vem da API por segurança, então deixamos em branco para ele criar uma nova se quiser)
        senha.value = "";
        confirmarSenha.value = "";

        const radio = document.querySelector(`input[name="tipoUsuario"][value="${u.tipoUsuario}"]`);
        if (radio) radio.checked = true;

        btnCadastrar.textContent = "Salvar Alterações";
        
        // Guarda o ID do BANCO na variável, para o SUBMIT saber quem atualizar
        usuarioEmEdicao = id; 
        
    } catch (erro) {
        alert("Erro ao buscar os dados do usuário para edição.");
    }
};

// Quando clicar em DELETAR na tabela
window.deletarUsuario = async function(id) {
    if (confirm("Tem certeza que deseja excluir este colaborador definitivamente?")) {
        try {
            // Manda a ordem de DELETE para o banco
            const resposta = await fetch(`${API_URL}/usuarios/${id}`, { method: "DELETE" });
            
            if (resposta.ok) {
                listarUsuarios(); // Se deletou, recarrega a tabela
            } else {
                throw new Error("Erro ao excluir.");
            }
        } catch (erro) {
            alert("Não foi possível excluir o colaborador.");
        }
    }
};

// Função para carregar os dados no formulário para edição
window.prepararEdicao = function(index) {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const u = usuarios[index];

    // Preenche os inputs com os dados atuais
    nome.value = u.nome;
    email.value = u.email;
    usuario.value = u.usuario;
    senha.value = u.senha;
    confirmarSenha.value = u.senha;

    // Seleciona o radio button correto (Administrador ou Funcionário)
    const radio = document.querySelector(`input[name="tipoUsuario"][value="${u.tipoUsuario}"]`);
    if (radio) radio.checked = true;

    // Muda o texto do botão para indicar que está editando
    btnCadastrar.textContent = "Salvar Alterações";
    
    // Guarda o índice que estamos editando
    usuarioEmEdicao = index;
};

// Função para deletar colaborador
window.deletarUsuario = function(index) {
    if (confirm("Tem certeza que deseja excluir este colaborador?")) {
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        usuarios.splice(index, 1); // Remove do array
        localStorage.setItem("usuarios", JSON.stringify(usuarios)); // Salva de volta
        listarUsuarios(); // Atualiza a tabela
    }
};

let usuarioEmEdicao = null;