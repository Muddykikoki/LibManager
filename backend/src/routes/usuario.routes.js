import { Router } from "express";
import * as userController from "../controllers/usuario.controller.js";
import { validar } from "../middlewares/validar.middleware.js";
import {
  usuarioSchema,
  atualizarUsuarioSchema,
} from "../schemas/usuario.schema.js";
import { exigirPerfil } from "../middlewares/perfil.middleware.js";
import { autenticar } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/criar",
  autenticar,
  exigirPerfil("DEV"),
  validar(usuarioSchema),
  userController.criarUsuario,
);

router.delete(
  "/deletar/:id",
  autenticar,
  exigirPerfil("DEV"),
  userController.deletar,
);

router.put(
  "/atualizar/:id",
  autenticar,
  exigirPerfil(1),
  validar(atualizarUsuarioSchema),
  userController.atualizarUsuario,
);

router.get(
  "/emprestimos/:id",
  autenticar,
  exigirPerfil("LEITOR"),
  userController.buscarEmprestimos,
);

router.get("/", autenticar, exigirPerfil(1), userController.listar);

export default router;
