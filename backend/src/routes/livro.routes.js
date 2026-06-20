import { Router } from "express";
import * as livroController from "../controllers/livro.controller.js";
import { validar } from "../middlewares/validar.middleware.js";
import { livroSchema, atualizarLivroSchema } from "../schemas/livro.schema.js";
import { exigirPerfil } from "../middlewares/perfil.middleware.js";
import { autenticar } from "../middlewares/auth.middleware.js";

const routes = new Router();

routes.post(
  "/cadastrar",
  autenticar,
  exigirPerfil(1),
  validar(livroSchema),
  livroController.cadastrar,
);

routes.put(
  "/editar/:id",
  autenticar,
  exigirPerfil(1),
  validar(atualizarLivroSchema),
  livroController.editar,
);

routes.delete(
  "/deletar/:id",
  autenticar,
  exigirPerfil(1),
  livroController.deletar,
);

routes.get("/", livroController.listar);

routes.get(
  "/encontrar",
  autenticar,
  exigirPerfil(0),
  livroController.encontrar,
);

export default routes;
