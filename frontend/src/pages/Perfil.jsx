import { useQuery } from "@tanstack/react-query";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { theme } from "../styles/theme";
import { table, badge } from "../styles/components";
import { perfil } from "../styles/dashboard";

export default function Perfil() {
  const { data: perfilData, isLoading } = useQuery({
    queryKey: ["perfil"],
    queryFn: async () => {
      const { data } = await api.get("/usuario/perfil", {
        params: { t: Date.now() },
      });
      return data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const { data: emprestimos } = useQuery({
    queryKey: ["meusEmprestimos"],
    queryFn: async () => {
      const { data } = await api.get("/emprestimo/meus", {
        params: { t: Date.now() },
      });
      return data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const { data: compras } = useQuery({
    queryKey: ["minhasCompras"],
    queryFn: async () => {
      const { data } = await api.get("/compra/minhas", {
        params: { t: Date.now() },
      });
      return data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const { data: reservas } = useQuery({
    queryKey: ["minhasReservas"],
    queryFn: async () => {
      const { data } = await api.get("/reserva/minhas", {
        params: { t: Date.now() },
      });
      return data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <div className={theme.stateLoading}>Carregando...</div>;

  return (
    <div className={theme.page}>
      <h1 className={theme.pageTitle + " mb-6"}>Meu Perfil</h1>

      {perfilData && (
        <div className={perfil.infoCard}>
          <p className={perfil.infoRow}>
            <strong>Nome:</strong> {perfilData.nome}
          </p>
          <p className={perfil.infoRow}>
            <strong>Email:</strong> {perfilData.email}
          </p>
          <p className={perfil.infoRow}>
            <strong>Perfil:</strong>{" "}
            <span className={badge(perfilData.nivel_perfil)}>
              {perfilData.nivel_perfil}
            </span>
          </p>
          <p className={perfil.infoRow}>
            <strong>Moedas:</strong> {perfilData.moedas || 0}
          </p>
        </div>
      )}

      <h2 className={perfil.sectionTitle}>Reservas</h2>
      <div className={perfil.sectionCard}>
        <table className={table.table}>
          <thead className={table.thead}>
            <tr>
              <th className={table.th}>Livro</th>
              <th className={table.th}>Status</th>
              <th className={table.th}>Expira em</th>
            </tr>
          </thead>
          <tbody>
            {reservas?.length === 0 ? (
              <tr>
                <td className={table.td} colSpan="3">
                  <div className={theme.stateEmpty}>Nenhuma reserva</div>
                </td>
              </tr>
            ) : (
              reservas?.map((r) => (
                <tr key={r.id} className={table.tr}>
                  <td className={table.td}>{r.livro?.titulo}</td>
                  <td className={table.td}>
                    <span className={badge(r.status)}>{r.status}</span>
                  </td>
                  <td className={table.td}>{r.expiraEm}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h2 className={perfil.sectionTitle}>Empréstimos</h2>
      <div className={perfil.sectionCard}>
        <table className={table.table}>
          <thead className={table.thead}>
            <tr>
              <th className={table.th}>Livro</th>
              <th className={table.th}>Estado</th>
              <th className={table.th}>Status</th>
              <th className={table.th}>Prevista</th>
              <th className={table.th}>Moedas</th>
            </tr>
          </thead>
          <tbody>
            {emprestimos?.length === 0 ? (
              <tr>
                <td className={table.td} colSpan="5">
                  <div className={theme.stateEmpty}>Nenhum empréstimo</div>
                </td>
              </tr>
            ) : (
              emprestimos?.map((e) => (
                <tr key={e.id} className={table.tr}>
                  <td className={table.td}>{e.exemplar?.livro?.titulo}</td>
                  <td className={table.td}>
                    <span className={badge(e.exemplar?.estado)}>
                      {e.exemplar?.estado}
                    </span>
                  </td>
                  <td className={table.td}>
                    <span className={badge(e.status)}>{e.status}</span>
                  </td>
                  <td className={table.td}>{e.dataPrevista}</td>
                  <td className={table.td}>{e.moedasGanhas || 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h2 className={perfil.sectionTitle}>Compras</h2>
      <div className={perfil.sectionCard}>
        <table className={table.table}>
          <thead className={table.thead}>
            <tr>
              <th className={table.th}>Livro</th>
              <th className={table.th}>Estado</th>
              <th className={table.th}>Preço</th>
              <th className={table.th}>Pago com</th>
            </tr>
          </thead>
          <tbody>
            {compras?.length === 0 ? (
              <tr>
                <td className={table.td} colSpan="4">
                  <div className={theme.stateEmpty}>Nenhuma compra</div>
                </td>
              </tr>
            ) : (
              compras?.map((c) => (
                <tr key={c.id} className={table.tr}>
                  <td className={table.td}>{c.exemplar?.livro?.titulo}</td>
                  <td className={table.td}>
                    <span className={badge(c.exemplar?.estado)}>
                      {c.exemplar?.estado}
                    </span>
                  </td>
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
