USE LibManager;


INSERT INTO Usuario (nome, email, senha_hash) VALUES
('João Silva', 'joao@email.com', 'hash123'),
('Maria Oliveira', 'maria@email.com', 'hash123'),
('Pedro Santos', 'pedro@email.com', 'hash123'),
('Ana Costa', 'ana@email.com', 'hash123'),
('Lucas Pereira', 'lucas@email.com', 'hash123');

INSERT INTO Livro (titulo, autor, editora, isbn, ano_publicacao, categoria) VALUES
('Dom Casmurro', 'Machado de Assis', 'Ática', '978000000001', 1899, 'Romance'),
('O Hobbit', 'J.R.R. Tolkien', 'HarperCollins', '978000000002', 1937, 'Fantasia'),
('Clean Code', 'Robert C. Martin', 'Prentice Hall', '978000000003', 2008, 'Tecnologia'),
('1984', 'George Orwell', 'Companhia das Letras', '978000000004', 1949, 'Ficção'),
('Harry Potter e a Pedra Filosofal', 'J.K. Rowling', 'Rocco', '978000000005', 1997, 'Fantasia');

INSERT INTO Estoque (id_livro, quantidade) VALUES
(1, 3),
(2, 5),
(3, 2),
(4, 4),
(5, 6);

INSERT INTO Emprestimo (
    id_usuario,
    id_livro,
    data_emprestimo,
    data_prevista,
    data_devolucao,
    status
) VALUES
(1, 2, '2026-05-01', '2026-05-15', '2026-05-12', 'DEVOLVIDO'),
(2, 3, '2026-05-20', '2026-06-03', NULL, 'EMPRESTADO'),
(3, 1, '2026-04-10', '2026-04-24', '2026-04-22', 'DEVOLVIDO'),
(4, 5, '2026-05-25', '2026-06-08', NULL, 'EMPRESTADO'),
(5, 4, '2026-05-10', '2026-05-24', NULL, 'ATRASADO');
