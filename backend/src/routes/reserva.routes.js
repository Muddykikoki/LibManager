import { Router } from "express";
import * as reservaController from "../controllers/reserva.controller.js";
import { autenticar } from "../middlewares/auth.middleware.js";
import { exigirPerfil } from "../middlewares/perfil.middleware.js";
import { validar } from "../middlewares/validar.middleware.js";
import { reservaSchema } from "../schemas/reserva.schema.js";

const routes = Router();

routes.post(
  "/reservar",
  autenticar,
  validar(reservaSchema),
  reservaController.criar,
);

routes.get("/", autenticar, exigirPerfil(1), reservaController.listarAtivas);

routes.get("/minhas", autenticar, reservaController.listarMinhas);

routes.put("/cancelar/:id", autenticar, reservaController.cancelar);

routes.put(
  "/concluir/:id",
  autenticar,
  exigirPerfil(1),
  reservaController.concluir,
);

export default routes;
