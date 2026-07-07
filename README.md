# OneMonth - Sistema de Gestão do Ciclo de Vida de Produtos

## 👥 Integrantes da Equipe

- Henry Gabriel
- João Elis
- Leandro Gonçalves
- Samuel Gomes

---

## 📖 Descrição do Projeto

O **OneMonth** é um sistema web desenvolvido como Trabalho de Conclusão de Curso (TCC) do curso Técnico em Desenvolvimento de Sistemas do SENAI.

O sistema tem como objetivo auxiliar no gerenciamento do ciclo de vida de produtos, permitindo o controle das diferentes etapas do desenvolvimento de um produto, desde seu cadastro até o acompanhamento de receitas, versionamento, testes, estoque e histórico de alterações.

A aplicação foi desenvolvida seguindo a arquitetura em camadas, utilizando uma API REST para comunicação entre o front-end e o back-end, proporcionando uma estrutura organizada, escalável e de fácil manutenção.

---

## 🚀 Tecnologias Utilizadas

### Front-end

- HTML5
- CSS3
- JavaScript

### Back-end

- Java 21
- Spring Boot
- Spring Data JPA
- Maven
- BCrypt

### Banco de Dados

- MySQL

### Ferramentas

- Git
- GitHub
- IntelliJ IDEA
- Visual Studio Code
- MySQL Workbench
- Postman
- Railway

---

## 📂 Estrutura do Repositório

```text
OneMonth
│
├── backend/          # Código-fonte da API REST
├── frontend/         # Interface do sistema
├── database/         # Script SQL, DER e Dicionário de Dados
├── docs/             # Documentação do projeto
└── README.md
```

---

## ▶️ Instruções para Execução

### 1. Clonar o repositório

```bash
git clone https://github.com/Henry4002/TCC-SENAI-BETIM-HENRY.git
```

### 2. Acessar a pasta do projeto

```bash
cd TCC-SENAI-BETIM-HENRY
```

### 3. Executar o Front-end

Acesse a pasta do front-end:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Inicie a aplicação:

```bash
npm run dev
```

O Vite disponibilizará um endereço semelhante a:

```text
http://localhost:5173
```

> **Observação:** O manual completo de instalação e execução do back-end encontra-se na documentação do projeto, disponível na pasta `docs`.

---

## 📄 Documentação

A documentação técnica do projeto encontra-se disponível na pasta `docs`, contendo informações sobre:

- Arquitetura do sistema;
- Tecnologias utilizadas;
- Estrutura do back-end;
- Banco de dados;
- Estrutura da API;
- Tratamento de exceções;
- Manual de instalação e execução do back-end.

---

## 📌 Observações

- O **back-end** está hospedado na plataforma **Railway**.
- O **banco de dados MySQL** também está hospedado na plataforma **Railway**.
- O **front-end** deve ser executado localmente para realizar a comunicação com a API.
