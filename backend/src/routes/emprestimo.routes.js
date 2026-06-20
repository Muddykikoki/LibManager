import { Router } from "express";
import * as emprestimoController from "../controllers/emprestimo.controller.js";
import { autenticar } from "../middlewares/auth.middleware.js";
import { exigirPerfil } from "../middlewares/perfil.middleware.js";
import { validar } from "../middlewares/validar.middleware.js";
import { emprestimoSchema } from "../schemas/emprestimo.schema.js";

const routes = Router();

routes.post(
  "/cadastrar",
  autenticar,
  exigirPerfil(1),
  validar(emprestimoSchema),
  emprestimoController.criar,
);
routes.get("/", autenticar, exigirPerfil(1), emprestimoController.listar);
routes.get("/meus", autenticar, emprestimoController.listarMeus);
routes.put(
  "/devolver/:id",
  autenticar,
  exigirPerfil(1),
  emprestimoController.devolver,
);

export default routes;
