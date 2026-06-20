import { Router } from "express";
import * as categoriaController from "../controllers/categoria.controller.js";
import { validar } from "../middlewares/validar.middleware.js";
import {
  categoriaSchema,
  atualizarCategoriaSchema,
} from "../schemas/categoria.schema.js";
import { exigirPerfil } from "../middlewares/perfil.middleware.js";
import { autenticar } from "../middlewares/auth.middleware.js";

const routes = new Router();

routes.post(
  "/cadastrar",
  autenticar,
  exigirPerfil(1),
  validar(categoriaSchema),
  categoriaController.cadastrar,
);

routes.put(
  "/editar/:id",
  autenticar,
  exigirPerfil(1),
  validar(atualizarCategoriaSchema),
  categoriaController.editar,
);

routes.delete(
  "/deletar/:id",
  autenticar,
  exigirPerfil(1),
  categoriaController.deletar,
);

routes.post(
  "/sub-categoria",
  autenticar,
  exigirPerfil(1),
  categoriaController.criarSubcategoria,
);

export default routes;
