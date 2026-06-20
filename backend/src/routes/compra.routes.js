import { Router } from "express";
import * as compraController from "../controllers/compra.controller.js";
import { autenticar } from "../middlewares/auth.middleware.js";
import { exigirPerfil } from "../middlewares/perfil.middleware.js";
import { validar } from "../middlewares/validar.middleware.js";
import { compraSchema } from "../schemas/compra.schema.js";

const routes = Router();

routes.post(
  "/comprar",
  autenticar,
  validar(compraSchema),
  compraController.comprar,
);

routes.get("/", autenticar, exigirPerfil(1), compraController.listar);

routes.get("/minhas", autenticar, compraController.listarMinhas);

export default routes;
