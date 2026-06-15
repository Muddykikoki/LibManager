import { prisma } from "../utils/prisma.js";

export async function criar(dados) {
    console.log("Criando usuário com dados:", dados);
    return prisma.User.create({data: dados,});
}

export async function buscarPorId(id) {
    return prisma.User.findUnique({where: {id: Number(id)},}); 
}

export async function buscarPorEmail(email) {
    return prisma.User.findUnique({where: {email},}); 
}

export async function atualizar(id, dados) {
    return prisma.User.update({where: {id: Number(id)}, data: dados,});
}

export async function buscarEmprestimos(id) {
    const emprestimo = await prisma.User.findUnique({
        where: { id: Number(id) },
        include: { emprestimos: true }
    });
    console.log("Emprestimos encontrados:", emprestimo);
    return emprestimo;
}