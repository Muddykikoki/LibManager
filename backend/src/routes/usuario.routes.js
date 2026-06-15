import { Router } from "express";
import * as userController from "../controllers/usuario.controller.js";
import { validar } from "../middlewares/validar.middleware.js";
import {usuarioSchema,atualizarUsuarioSchema} from "../schemas/usuario.schema.js";
import { exigirPerfil } from "../middlewares/perfil.middleware.js";

const router = Router();

router.post("/criar",exigirPerfil("DEV"),validar(usuarioSchema),userController.criarUsuario);

router.put("/atualizar/:id",exigirPerfil("BIBLIOTECARIA"),validar(atualizarUsuarioSchema),userController.atualizarUsuario);

router.get("/emprestimos/:id",exigirPerfil("LEITOR"),userController.buscarEmprestimos);

export default router;