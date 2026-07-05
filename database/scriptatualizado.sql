CREATE DATABASE IF NOT EXISTS tcc_gestao_produtos;
USE tcc_gestao_produtos;

CREATE TABLE perfil (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE status_versao_receita (
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

CREATE TABLE produto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    descricao TEXT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    idUsuario INT NOT NULL,
    FOREIGN KEY (idUsuario) REFERENCES usuario(id)
);

CREATE TABLE estoque (
    id INT PRIMARY KEY AUTO_INCREMENT,
    data_atualizacao DATETIME NOT NULL,
    qtd_minima INT NOT NULL,
    quantidade INT NOT NULL,
    lote VARCHAR(100) NOT NULL,
    data_validade DATE NOT NULL,
    data_fabricacao DATE NOT NULL,
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
    descricao TEXT NOT NULL,
    idReceita INT NOT NULL,
    idStatusVersaoReceita INT NOT NULL,
    FOREIGN KEY (idReceita) REFERENCES receita(id),
    FOREIGN KEY (idStatusVersaoReceita) REFERENCES status_versao_receita(id)
    
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
    acao TEXT NOT NULL,
    data_historico DATETIME NOT NULL,
    idProduto INT NOT NULL,
    idUsuario INT NOT NULL,
    FOREIGN KEY (idProduto) REFERENCES produto(id),
    FOREIGN KEY (idUsuario) REFERENCES usuario(id)
);










