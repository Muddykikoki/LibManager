export const validar = (schema, local = "body") => {
  return (req, res, next) => {
    try {
      const resultado = schema.parse(req[local]);

      req[local] = resultado;

      next();
    } catch (error) {
      return res.status(400).json({
        erro: "Dados inválidos",
        detalhes: error.errors || error.issues,
      });
    }
  };
};