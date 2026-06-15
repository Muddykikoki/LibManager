import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./usuario.routes.js";
// import livroRoutes from "./livro.routes.js";
// import categoriaRoutes from "./categoria.routes.js";
// import emprestimoRoutes from "./emprestimo.routes.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Tudo OK na api" });
});

router.use("/auth", authRoutes);
router.use("/usuario", userRoutes);
// router.use("/livros", livroRoutes);
// router.use("/categorias", categoriaRoutes);
// router.use("/emprestimos", emprestimoRoutes);

export default router;