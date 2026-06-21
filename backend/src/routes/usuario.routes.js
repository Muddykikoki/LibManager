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
  exigirPerfil(1),
  validar(usuarioSchema),
  userController.criarUsuario,
);

router.put(
  "/editar/:id",
  autenticar,
  exigirPerfil(1),
  validar(atualizarUsuarioSchema),
  userController.atualizarUsuario,
);

router.delete(
  "/deletar/:id",
  autenticar,
  exigirPerfil(1),
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

router.get("/perfil", autenticar, userController.meuPerfil);

router.get("/encontrar", autenticar, exigirPerfil(1), userController.encontrar);

export default router;
