import { Router } from "express";
import * as exemplarController from "../controllers/exemplar.controller.js";
import { autenticar } from "../middlewares/auth.middleware.js";
import { exigirPerfil } from "../middlewares/perfil.middleware.js";
import { validar } from "../middlewares/validar.middleware.js";
import {
  exemplarSchema,
  atualizarEstadoSchema,
} from "../schemas/exemplar.schema.js";

const routes = Router();

routes.post(
  "/cadastrar",
  autenticar,
  exigirPerfil(1),
  validar(exemplarSchema),
  exemplarController.criar,
);

routes.get("/livro/:livroId", exemplarController.listarPorLivro);

routes.get("/disponiveis/:livroId", exemplarController.listarDisponiveis);

routes.put(
  "/estado/:id",
  autenticar,
  exigirPerfil(1),
  validar(atualizarEstadoSchema),
  exemplarController.atualizarEstado,
);

export default routes;
