-- CRIAÇÃO DO BANCO
CREATE DATABASE IF NOT EXISTS tcc_gestao_produtos;
USE tcc_gestao_produtos;

-- CRIAÇÃO DAS TABELAS
CREATE TABLE perfil (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    idPerfil INT NOT NULL,
    FOREIGN KEY (idPerfil) REFERENCES perfil(id)
);

CREATE TABLE status_produto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE produto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    descricao TEXT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    idStatus INT NOT NULL,
    idUsuario INT NOT NULL,
    FOREIGN KEY (idStatus) REFERENCES status_produto(id),
    FOREIGN KEY (idUsuario) REFERENCES usuario(id)
);

CREATE TABLE estoque (
    id INT PRIMARY KEY AUTO_INCREMENT,
    data_atualizacao DATETIME NOT NULL,
    qtd_minima INT NOT NULL,
    quantidade INT NOT NULL,
    idProduto INT NOT NULL UNIQUE,
    FOREIGN KEY (idProduto) REFERENCES produto(id)
);

CREATE TABLE receita (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    idProduto INT NOT NULL,
    FOREIGN KEY (idProduto) REFERENCES produto(id)
);

CREATE TABLE versao_receita (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero_versao INT NOT NULL,
    data_versao DATE NOT NULL,
    idReceita INT NOT NULL,
    FOREIGN KEY (idReceita) REFERENCES receita(id)
);

CREATE TABLE teste (
    id INT PRIMARY KEY AUTO_INCREMENT,
    data_teste DATE NOT NULL,
    resultado VARCHAR(200) NOT NULL,
    idUsuario INT NOT NULL,
    idVersao_receita INT NOT NULL,
    FOREIGN KEY (idUsuario) REFERENCES usuario(id),
    FOREIGN KEY (idVersao_receita) REFERENCES versao_receita(id)
);

CREATE TABLE historico (
    id INT PRIMARY KEY AUTO_INCREMENT,
    acao VARCHAR(200) NOT NULL,
    data_historico DATETIME NOT NULL,
    idProduto INT NOT NULL,
    idUsuario INT NOT NULL,
    FOREIGN KEY (idProduto) REFERENCES produto(id),
    FOREIGN KEY (idUsuario) REFERENCES usuario(id)
);

-- INSERINDO DADOS FICTÍCIOS DE TESTE

INSERT INTO perfil (nome)
VALUES ('Administrador'), ('Funcionario');

INSERT INTO status_produto (nome)
VALUES ('Em desenvolvimento'), ('Em teste'), ('Aprovado');

INSERT INTO usuario (nome, senha, email, idPerfil)
VALUES ('Henry Gabriel', '123456@tcc', 'henrytesteTCC@email.com', 1);

INSERT INTO produto (descricao, nome, idStatus, idUsuario)
VALUES ('Pão de queijo tradicional mineiro', 'Pão de Queijo', 1, 1);

INSERT INTO estoque (data_atualizacao, qtd_minima, quantidade, idProduto)
VALUES (NOW(), 20, 150, 1);

