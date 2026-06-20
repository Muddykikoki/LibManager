const HIERARQUIA = { LEITOR: 0, BIBLIOTECARIO: 1, DEV: 2 };

function resolverNivel(p) {
  if (typeof p === "number") return p;
  return HIERARQUIA[p];
}

export function exigirPerfil(...perfisPermitidos) {
  return (req, res, next) => {
    const nivelUser = resolverNivel(req.user?.nivel_perfil);
    const temPermissao = perfisPermitidos.some(
      (p) => nivelUser >= resolverNivel(p),
    );
    if (!temPermissao)
      return res.status(403).json({ message: "Acesso negado" });
    next();
  };
}
