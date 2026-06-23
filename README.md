# 📚 LibManager — Sistema de Biblioteca

Sistema completo de gerenciamento de biblioteca com **catálogo de livros**, **categorias**, **exemplares**, **empréstimos**, **reservas** e **compras**.

Arquitetura separada em:
- **backend** → API (Node.js + Express + Prisma + MongoDB)  
- **frontend** → Interface web (Vite)

---

## ⚙️ Pré requisitos

Instale antes de começar:

| **Ferramenta** | **Versão recomendada** |
|---------------|------------------------|
| Node.js       | v18+                   |
| MongoDB       | Community              |
| mongosh       | latest                 |
| MongoDB Database Tools | latest         |
| Git           | latest                 |

---

## 📦 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/Muddykikoki/LibManager.git
cd LibManager
```

---

## 🧠 Backend

```bash
cd backend
npm install
```

**Variáveis de ambiente**

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

**Banco de dados**

Siga a ordem abaixo para preparar o banco de dados:

Altere a linha 7 de `url=env("DATABASE_URL_PROD")` para `url=env("DATABASE_URL_DEV")`
```bash
npm run genPrisma
npm run pushPrisma
npm run db:seed
```

**Iniciar servidor**

```bash
npm run dev
```

Servidor disponível em: **http://localhost:3000/api**

---

## 🎨 Frontend

```bash
cd ../frontend
npm install
```

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Inicie o frontend:

```bash
npm run dev
```

A aplicação estará em: **http://localhost:5173**

---

## 🧪 Comandos úteis Backend

| **Comando**            | **Descrição**                       |
|------------------------|-------------------------------------|
| `npm run dev`          | Inicia API com hot reload           |
| `npm run dev:f`        | Inicia sem rodar Prisma             |
| `npm run genPrisma`    | Gera Prisma Client                  |
| `npm run pushPrisma`   | Sincroniza schema com MongoDB       |
| `npm run db:seed`      | Popula banco com dados iniciais     |
| `npm run db:export`    | Exporta dados do banco              |
| `npm run lint`         | Verifica problemas de código        |
| `npm run debug:fix`    | Corrige problemas com ESLint        |
| `npm run format`       | Formata código com Prettier         |

**Reaplicar seed**

```bash
npm run db:seed
```

Atualiza o banco usando o script de seed.

---

## 👤 Perfis de usuário padrão

| **Perfil**        | **Permissões**                             | **Email**                                   | **Senha** |
|-------------------|--------------------------------------------|---------------------------------------------|-----------|
| **LEITOR**        | Consultar catálogo, reservar livros        | leitor@leitor.com                            | 123456    |
| **BIBLIOTECARIO** | Gerenciar livros, empréstimos e reservas   | bi@bi.com                                    | 123456    |
| **DEV**           | Acesso total ao sistema                    | dev@dev.com                                  | 123456    |

---

## 🔧 Dicas e observações

- Mantenha o **MongoDB** rodando antes de executar os comandos do Prisma.  
- Se houver problemas com o Prisma Client, execute `npm run genPrisma` novamente.  
- Para desenvolvimento local, use os scripts `dev` para backend e frontend simultaneamente em terminais separados.  
- Atualize as variáveis de ambiente conforme necessário para conexões externas ou credenciais.
