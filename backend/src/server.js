import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes/index.routes.js";

//midd de data pequena gambiara espero que funcione
import { formatarResposta } from "./middlewares/formatarDatas.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

//teste de rota raiz para verificar se o servidor está rodando
app.use(formatarResposta);
app.get("/", (req, res) => {
  res.json({
    message: `Servidor rodando! Acesse http://localhost:${process.env.PORT || 3000}/api para utilizar a API.`,
  });
});

app.use("/api", routes);

app.use((req, res, next) => {
  console.log("REQ RECEBIDA:", req.method, req.url);
  next();
});

app.listen(3000, () => {
  console.log("API rodando em http://localhost:3000/api");
});
