import { Router } from "express";
import * as compraController from "../controllers/compra.controller.js";
import { autenticar } from "../middlewares/auth.middleware.js";
import { exigirPerfil } from "../middlewares/perfil.middleware.js";
import { validar } from "../middlewares/validar.middleware.js";
import { compraSchema } from "../schemas/compra.schema.js";

const routes = Router();

routes.post(
  "/solicitar",
  autenticar,
  validar(compraSchema),
  compraController.solicitar,
);
routes.post(
  "/solicitar-moedas",
  autenticar,
  validar(compraSchema),
  compraController.solicitarComMoedas,
);
routes.put(
  "/concluir/:id",
  autenticar,
  exigirPerfil(1),
  compraController.concluir,
);
routes.put(
  "/cancelar/:id",
  autenticar,
  exigirPerfil(1),
  compraController.cancelar,
);
routes.get("/", autenticar, exigirPerfil(1), compraController.listar);
routes.get(
  "/pendentes",
  autenticar,
  exigirPerfil(1),
  compraController.listarPendentes,
);
routes.get("/minhas", autenticar, compraController.listarMinhas);

export default routes;
