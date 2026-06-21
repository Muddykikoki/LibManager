import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api";
import Confirm from "../components/Confirm";
import { useToast } from "../components/Toast";
import { theme } from "../styles/theme";
import { table, btn, badge, tabs } from "../styles/components";
import { dashboard } from "../styles/dashboard";

export default function Compras() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [aba, setAba] = useState("pendentes");
  const [confirmAction, setConfirmAction] = useState(null);

  const { data: pendentes, isLoading: loadingPendentes } = useQuery({
    queryKey: ["compras", "pendentes"],
    queryFn: async () => {
      const { data } = await api.get("/compra/pendentes");
      return data;
    },
    enabled: aba === "pendentes",
  });

  const { data: todas, isLoading: loadingTodas } = useQuery({
    queryKey: ["compras", "todas"],
    queryFn: async () => {
      const { data } = await api.get("/compra/");
      return data;
    },
    enabled: aba === "todas",
  });

  const concluirMutation = useMutation({
    mutationFn: (id) => api.put(`/compra/concluir/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compras"] });
      queryClient.invalidateQueries({ queryKey: ["livros"] });
      toast.success("Compra confirmada", "Pagamento registrado com sucesso.");
    },
    onError: (err) => {
      toast.error("Erro", err.response?.data?.error || "Tente novamente.");
    },
  });

  const cancelarMutation = useMutation({
    mutationFn: (id) => api.put(`/compra/cancelar/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compras"] });
      queryClient.invalidateQueries({ queryKey: ["livros"] });
      toast.success("Compra cancelada", "A compra foi cancelada.");
    },
    onError: (err) => {
      toast.error("Erro", err.response?.data?.error || "Tente novamente.");
    },
  });

  const dados = aba === "pendentes" ? pendentes : todas;
  const loading = aba === "pendentes" ? loadingPendentes : loadingTodas;

  return (
    <div className={dashboard.container}>
      <div className={dashboard.header}>
        <h1 className={dashboard.title}>Compras</h1>
      </div>

      <div className={tabs.container}>
        <button
          className={`${tabs.tab} ${aba === "pendentes" ? tabs.active : ""}`}
          onClick={() => setAba("pendentes")}
        >
          Pendentes
        </button>
        <button
          className={`${tabs.tab} ${aba === "todas" ? tabs.active : ""}`}
          onClick={() => setAba("todas")}
        >
          Histórico
        </button>
      </div>

      {loading && <div className={theme.stateLoading}>Carregando...</div>}

      {dados && (
        <div className={table.card}>
          <table className={table.table}>
            <thead className={table.thead}>
              <tr>
                <th className={table.th}>Livro</th>
                <th className={table.th}>Estado</th>
                <th className={table.th}>Comprador</th>
                <th className={table.th}>Preço</th>
                <th className={table.th}>Pago com</th>
                <th className={table.th}>Status</th>
                <th className={table.th}>Data</th>
                {aba === "pendentes" && <th className={table.th}>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {dados.length === 0 ? (
                <tr>
                  <td
                    className={table.td}
                    colSpan={aba === "pendentes" ? 8 : 7}
                  >
                    <div className={theme.stateEmpty}>
                      {aba === "pendentes"
                        ? "Nenhuma compra pendente"
                        : "Nenhuma compra registrada"}
                    </div>
                  </td>
                </tr>
              ) : (
                dados.map((c) => (
                  <tr key={c.id} className={table.tr}>
                    <td className={table.td}>
                      <strong>{c.exemplar?.livro?.titulo || "—"}</strong>
                      <div className={table.sub}>
                        {c.exemplar?.livro?.autor}
                      </div>
                    </td>
                    <td className={table.td}>
                      <span className={badge(c.exemplar?.estado)}>
                        {c.exemplar?.estado || "—"}
                      </span>
                    </td>
                    <td className={table.td}>{c.user?.nome || "—"}</td>
                    <td className={table.td}>
                      {c.pagoMoedas
                        ? `${c.precoPago} moedas`
                        : `R$ ${c.precoPago?.toFixed(2)}`}
                    </td>
                    <td className={table.td}>
                      <span className={badge(c.pagoMoedas ? "DEV" : "LEITOR")}>
                        {c.pagoMoedas ? "Moedas" : "Dinheiro"}
                      </span>
                    </td>
                    <td className={table.td}>
                      <span className={badge(c.status)}>{c.status}</span>
                    </td>
                    <td className={table.td}>{c.createdAt}</td>
                    {aba === "pendentes" && (
                      <td className={table.td}>
                        <div className={table.actions}>
                          <button
                            className={btn("success", "sm")}
                            onClick={() =>
                              setConfirmAction({
                                type: "concluir",
                                id: c.id,
                                titulo: "Confirmar Pagamento",
                                msg: `Confirmar pagamento de "${c.exemplar?.livro?.titulo}" por ${c.user?.nome}?`,
                              })
                            }
                          >
                            Confirmar
                          </button>
                          <button
                            className={btn("danger", "sm")}
                            onClick={() =>
                              setConfirmAction({
                                type: "cancelar",
                                id: c.id,
                                titulo: "Cancelar Compra",
                                msg: `Cancelar compra de "${c.exemplar?.livro?.titulo}" por ${c.user?.nome}? O exemplar voltará a ficar disponível.`,
                              })
                            }
                          >
                            Cancelar
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      <Confirm
        aberto={!!confirmAction}
        fechar={() => setConfirmAction(null)}
        confirmar={() => {
          if (confirmAction.type === "concluir")
            concluirMutation.mutate(confirmAction.id);
          if (confirmAction.type === "cancelar")
            cancelarMutation.mutate(confirmAction.id);
        }}
        titulo={confirmAction?.titulo || ""}
        mensagem={confirmAction?.msg || ""}
        variant={confirmAction?.type === "cancelar" ? "danger" : "success"}
        confirmText={
          confirmAction?.type === "concluir" ? "Confirmar" : "Cancelar Compra"
        }
      />
    </div>
  );
}
