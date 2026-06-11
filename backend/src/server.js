import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes/index.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

//teste de rota raiz para verificar se o servidor está rodando
app.get("/", (req, res) => {
  res.json({ message: `Servidor rodando! Acesse http://localhost:${process.env.PORT || 3000}/api para utilizar a API.` });
});

app.use("/api", routes);

app.listen(3000, () => {
  console.log("API rodando em http://localhost:3000/api");
});