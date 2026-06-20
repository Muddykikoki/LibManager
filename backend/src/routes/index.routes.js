import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./usuario.routes.js";
import livroRoutes from "./livro.routes.js";
import categoriaRoutes from "./categoria.routes.js";
import exemplarRoutes from "./exemplar.routes.js";
import emprestimoRoutes from "./emprestimo.routes.js";
import compraRoutes from "./compra.routes.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Tudo OK na api" });
});

router.use("/auth", authRoutes);
router.use("/usuario", userRoutes);
router.use("/livro", livroRoutes);
router.use("/categoria", categoriaRoutes);
router.use("/exemplar", exemplarRoutes);
router.use("/emprestimo", emprestimoRoutes);
router.use("/compra", compraRoutes);

export default router;
