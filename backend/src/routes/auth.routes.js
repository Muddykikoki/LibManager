import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validar } from "../middlewares/validar.middleware.js";
import {loginSchema,refreshSchema,} from "../schemas/auth.schema.js";
const router = Router();

router.post("/login",validar(loginSchema),authController.login);

router.post("/refresh",validar(refreshSchema),authController.refresh);

router.post("/logout",validar(refreshSchema),authController.logout);


export default router;