import { useQueryClient } from "@tanstack/react-query";
import api from "../api/api";
import { useToast } from "../components/Toast";
import { btn, badge, exemplarAcoes } from "../styles/components";

const PRECO_ESTADO = { NOVO: 1.2, OTIMO: 1.0, BOM: 0.85, USADO: 0.5 };

export default function ExemplarAcoes({ livro, jaReservado }) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const disponiveis =
    livro.exemplares?.filter((e) => e.disponivel && !e.vendido) || [];

  async function handleReservar(estado) {
    try {
      await api.post("/reserva/reservar", { livroId: livro.id, estado });
      toast.success("Reserva realizada", "Válido por 24h. Retire no balcão.");
      queryClient.invalidateQueries({ queryKey: ["minhasReservas"] });
      queryClient.invalidateQueries({ queryKey: ["livros"] });
    } catch (err) {
      toast.error(
        "Erro ao reservar",
        err.response?.data?.error || "Tente novamente.",
      );
    }
  }

  async function handleComprar(exemplarId) {
    try {
      await api.post("/compra/solicitar", { exemplarId });
      toast.success(
        "Solicitação enviada",
        "Aguarde o bibliotecário confirmar o pagamento.",
      );
    } catch (err) {
      toast.error(
        "Erro ao solicitar",
        err.response?.data?.error || "Tente novamente.",
      );
    }
  }

  async function handleComprarMoedas(exemplarId) {
    try {
      await api.post("/compra/solicitar-moedas", { exemplarId });
      toast.success(
        "Solicitação enviada",
        "Aguarde o bibliotecário confirmar.",
      );
    } catch (err) {
      toast.error(
        "Erro ao solicitar",
        err.response?.data?.error || "Tente novamente.",
      );
    }
  }

  if (jaReservado) {
    return (
      <p className="text-glow-400 text-sm text-center mt-4">
        Você já reservou este livro
      </p>
    );
  }

  if (disponiveis.length === 0) {
    return (
      <p className="text-red-400 text-sm text-center mt-4">
        Sem exemplares disponíveis
      </p>
    );
  }

  const agrupados = disponiveis.reduce((acc, ex) => {
    if (!acc[ex.estado]) acc[ex.estado] = { count: 0 };
    acc[ex.estado].count++;
    return acc;
  }, {});

  return (
    <div className={exemplarAcoes.container}>
      <div className={exemplarAcoes.grupo}>
        <h4 className={exemplarAcoes.titulo}>Reservar (retira no balcão)</h4>
        <div className={exemplarAcoes.botoes}>
          {Object.entries(agrupados).map(([estado, grupo]) => (
            <button
              key={`reservar-${estado}`}
              className={btn("primary")}
              onClick={() => handleReservar(estado)}
            >
              <span className={badge(estado)}>{estado}</span>
              {grupo.count} disponível(is)
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className={exemplarAcoes.titulo}>Comprar</h4>
        <div className={exemplarAcoes.botoes}>
          {disponiveis.map((ex) => {
            const preco = (livro.preco * PRECO_ESTADO[ex.estado]).toFixed(2);
            const precoMoedas = Math.ceil(livro.preco * 2.5);

            return (
              <div key={ex.id} className={exemplarAcoes.compraCard}>
                <span className={badge(ex.estado)}>{ex.estado}</span>
                <button
                  className={`${btn("primary", "sm")} w-full`}
                  onClick={() => handleComprar(ex.id)}
                >
                  R$ {preco}
                </button>
                {ex.estado === "NOVO" && (
                  <button
                    className={`${btn("secondary", "sm")} w-full`}
                    onClick={() => handleComprarMoedas(ex.id)}
                  >
                    {precoMoedas} moedas
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
