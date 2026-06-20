const FUSO = -3;

function formatarData(date) {
  const ajustado = new Date(date.getTime() + FUSO * 60 * 60 * 1000);
  const ano = ajustado.getUTCFullYear();
  const mes = String(ajustado.getUTCMonth() + 1).padStart(2, "0");
  const dia = String(ajustado.getUTCDate()).padStart(2, "0");
  const hora = String(ajustado.getUTCHours()).padStart(2, "0");
  const min = String(ajustado.getUTCMinutes()).padStart(2, "0");
  return `${ano}-${mes}-${dia} ${hora}:${min}`;
}

function formatarDatas(obj) {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map(formatarDatas);
  }
  if (obj instanceof Date) {
    return formatarData(obj);
  }
  if (typeof obj === "object") {
    const resultado = {};
    for (const [key, value] of Object.entries(obj)) {
      resultado[key] = formatarDatas(value);
    }
    return resultado;
  }
  return obj;
}
export function formatarResposta(req, res, next) {
  const originalJson = res.json.bind(res);
  res.json = function (data) {
    const formatado = formatarDatas(data);
    return originalJson(formatado);
  };
  next();
}
