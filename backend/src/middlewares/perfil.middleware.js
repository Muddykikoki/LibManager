const HIERARQUIA = { LEITOR: 0, BIBLIOTECARIO: 1, DEV: 2 };

export function exigirPerfil(...perfisPermitidos) {
  return (req, res, next) => {
    const nivelUser = HIERARQUIA[req.user?.nivel_perfil];
    console.log("Perfil do usuário:", req.user?.nivel_perfil);
    const temPermissao = perfisPermitidos.some(
      (p) => {
        console.log(nivelUser, HIERARQUIA[p]);
        return nivelUser >= HIERARQUIA[p];
      }
    );
    if (!temPermissao)
      return res.status(403).json({ message: "Acesso negado" });
    next();
  };
}