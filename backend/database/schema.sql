CREATE DATABASE IF NOT EXISTS LibManager;

USE LibManager;

CREATE TABLE IF NOT EXISTS Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Livro (
    id_livro INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    editora VARCHAR(255),
    isbn VARCHAR(20) UNIQUE,
    ano_publicacao SMALLINT,
    categoria VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Estoque (
    id_estoque INT AUTO_INCREMENT PRIMARY KEY,
    id_livro INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 0,

    FOREIGN KEY (id_livro) REFERENCES Livro(id_livro) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Emprestimo (
    id_emprestimo INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_livro INT NOT NULL,
    data_emprestimo DATE NOT NULL,
    data_prevista DATE NOT NULL,
    data_devolucao DATE NULL,
    status ENUM('EMPRESTADO','DEVOLVIDO','ATRASADO') DEFAULT 'EMPRESTADO',

    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_livro) REFERENCES Livro(id_livro)
);

