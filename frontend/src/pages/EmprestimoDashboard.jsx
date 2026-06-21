import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiPlus, FiSearch } from "react-icons/fi";
import api from "../api/api";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import { theme } from "../styles/theme";
import { table, btn, badge, form, tabs, dropdown } from "../styles/components";
import { dashboard, emprestimoDashboard } from "../styles/dashboard";
import Confirm from "../components/Confirm";
import { useToast } from "../components/Toast";

export default function EmprestimoDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const ehAdmin =
    user?.nivel_perfil === "BIBLIOTECARIO" || user?.nivel_perfil === "DEV";

  const [aba, setAba] = useState("emprestimos");
  const [modalEmprestimo, setModalEmprestimo] = useState(false);
  const [modalConcluir, setModalConcluir] = useState(null);
  const [modalDevolucao, setModalDevolucao] = useState(null);
  const [estadoDevolucao, setEstadoDevolucao] = useState("BOM");
  const [buscaUser, setBuscaUser] = useState("");
  const [buscaLivro, setBuscaLivro] = useState("");
  const [userSelecionado, setUserSelecionado] = useState(null);
  const [exemplarSelecionado, setExemplarSelecionado] = useState(null);
  const [diasEmprestimo, setDiasEmprestimo] = useState(14);
  const [msg, setMsg] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const toast = useToast();

  const { data: emprestimos } = useQuery({
    queryKey: ["emprestimos"],
    queryFn: async () => {
      if (ehAdmin) {
        const { data } = await api.get("/emprestimo/", {
          params: { t: Date.now() },
        });
        return data;
      }
      const { data } = await api.get("/emprestimo/meus", {
        params: { t: Date.now() },
      });
      return data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const { data: reservas } = useQuery({
    queryKey: ["reservas"],
    queryFn: async () => {
      if (ehAdmin) {
        const { data } = await api.get("/reserva/", {
          params: { t: Date.now() },
        });
        return data;
      }
      const { data } = await api.get("/reserva/minhas", {
        params: { t: Date.now() },
      });
      return data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const { data: usuariosBusca } = useQuery({
    queryKey: ["usuariosBusca", buscaUser],
    queryFn: async () => {
      const { data } = await api.get(
        `/usuario/encontrar?q=${encodeURIComponent(buscaUser)}`,
      );
      return data;
    },
    enabled: ehAdmin && buscaUser.length >= 2,
    staleTime: 0,
  });

  const { data: livrosBusca } = useQuery({
    queryKey: ["livrosBusca", buscaLivro],
    queryFn: async () => {
      const { data } = await api.get(
        `/livro/encontrar?q=${encodeURIComponent(buscaLivro)}`,
      );
      return data;
    },
    enabled: ehAdmin && buscaLivro.length >= 2,
    staleTime: 0,
  });

  const devolverMutation = useMutation({
    mutationFn: ({ id, estado }) =>
      api.put(`/emprestimo/devolver/${id}`, { estado }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emprestimos"] });
      setModalDevolucao(null);
      toast.success("Devolução registrada", "Livro devolvido com sucesso.");
    },
    onError: (err) => {
      toast.error("Erro", err.response?.data?.error || "Tente novamente.");
    },
  });

  const concluirReservaMutation = useMutation({
    mutationFn: ({ id, dias }) => api.put(`/reserva/concluir/${id}`, { dias }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservas"] });
      queryClient.invalidateQueries({ queryKey: ["emprestimos"] });
      setModalConcluir(null);
      toast.success("Empréstimo criado", "Reserva convertida em empréstimo.");
    },
    onError: (err) => {
      toast.error("Erro", err.response?.data?.error || "Tente novamente.");
    },
  });

  const cancelarReservaMutation = useMutation({
    mutationFn: (id) => api.put(`/reserva/cancelar/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservas"] });
      toast.success("Reserva cancelada", "A reserva foi cancelada.");
    },
    onError: (err) => {
      toast.error("Erro", err.response?.data?.error || "Tente novamente.");
    },
  });

  const criarEmprestimoMutation = useMutation({
    mutationFn: (dados) => api.post("/emprestimo/cadastrar", dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emprestimos"] });
      setModalEmprestimo(false);
      setUserSelecionado(null);
      setExemplarSelecionado(null);
      setBuscaUser("");
      setBuscaLivro("");
      setDiasEmprestimo(14);
      setMsg("");
      toast.success("Empréstimo criado", "Empréstimo registrado com sucesso.");
    },
    onError: (err) => {
      setMsg(err.response?.data?.error || "Erro ao criar empréstimo");
      toast.error("Erro", err.response?.data?.error || "Tente novamente.");
    },
  });

  function handleCriarEmprestimo() {
    setMsg("");
    if (!userSelecionado) {
      setMsg("Selecione um usuário");
      return;
    }
    if (!exemplarSelecionado) {
      setMsg("Selecione um exemplar");
      return;
    }
    criarEmprestimoMutation.mutate({
      usuarioId: userSelecionado.id,
      exemplarId: exemplarSelecionado.id,
      dias: diasEmprestimo,
    });
  }

  return (
    <div className={dashboard.container}>
      <div className={dashboard.header}>
        <h1 className={dashboard.title}>
          {ehAdmin ? "Operações" : "Meus Empréstimos"}
        </h1>
        {ehAdmin && (
          <button
            className={btn("primary")}
            onClick={() => {
              setModalEmprestimo(true);
              setMsg("");
            }}
          >
            <FiPlus size={18} /> Novo Empréstimo
          </button>
        )}
      </div>

      <div className={tabs.container}>
        <button
          className={`${tabs.tab} ${aba === "emprestimos" ? tabs.active : ""}`}
          onClick={() => setAba("emprestimos")}
        >
          Empréstimos
        </button>
        <button
          className={`${tabs.tab} ${aba === "reservas" ? tabs.active : ""}`}
          onClick={() => setAba("reservas")}
        >
          Reservas
        </button>
      </div>
      {aba === "emprestimos" && (
        <div className={table.card}>
          <table className={table.table}>
            <thead className={table.thead}>
              <tr>
                {ehAdmin && <th className={table.th}>Usuário</th>}
                <th className={table.th}>Livro</th>
                <th className={table.th}>Exemplar</th>
                <th className={table.th}>Status</th>
                <th className={table.th}>Prevista</th>
                <th className={table.th}>Devolução</th>
                <th className={table.th}>Moedas</th>
                {ehAdmin && <th className={table.th}>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {!emprestimos || emprestimos.length === 0 ? (
                <tr>
                  <td className={table.td} colSpan={ehAdmin ? 8 : 6}>
                    <div className={theme.stateEmpty}>Nenhum empréstimo</div>
                  </td>
                </tr>
              ) : (
                emprestimos.map((e) => (
                  <tr key={e.id} className={table.tr}>
                    {ehAdmin && (
                      <td className={table.td}>{e.usuario?.nome || "—"}</td>
                    )}
                    <td className={table.td}>
                      <strong>{e.exemplar?.livro?.titulo || "—"}</strong>
                      <div className={table.sub}>
                        {e.exemplar?.livro?.autor}
                      </div>
                    </td>
                    <td className={table.td}>
                      <span className={badge(e.exemplar?.estado)}>
                        {e.exemplar?.estado || "—"}
                      </span>
                    </td>
                    <td className={table.td}>
                      <span className={badge(e.status)}>{e.status}</span>
                    </td>
                    <td className={table.td}>{e.dataPrevista}</td>
                    <td className={table.td}>{e.dataDevolucao || "—"}</td>
                    <td className={table.td}>{e.moedasGanhas || 0}</td>
                    {ehAdmin && (
                      <td className={table.td}>
                        {e.status === "EMPRESTADO" && (
                          <button
                            className={btn("primary", "sm")}
                            onClick={() => {
                              setEstadoDevolucao("BOM");
                              setModalDevolucao(e);
                            }}
                          >
                            Devolver
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {aba === "reservas" && (
        <div className={table.card}>
          <table className={table.table}>
            <thead className={table.thead}>
              <tr>
                {ehAdmin && <th className={table.th}>Usuário</th>}
                <th className={table.th}>Livro</th>
                <th className={table.th}>Exemplar</th>
                <th className={table.th}>Status</th>
                <th className={table.th}>Expira em</th>
                <th className={table.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {!reservas || reservas.length === 0 ? (
                <tr>
                  <td className={table.td} colSpan={ehAdmin ? 6 : 4}>
                    <div className={theme.stateEmpty}>Nenhuma reserva</div>
                  </td>
                </tr>
              ) : (
                reservas.map((r) => (
                  <tr key={r.id} className={table.tr}>
                    {ehAdmin && (
                      <td className={table.td}>{r.user?.nome || "—"}</td>
                    )}
                    <td className={table.td}>
                      <strong>{r.livro?.titulo || "—"}</strong>
                      <div className={table.sub}>{r.livro?.autor}</div>
                    </td>
                    <td className={table.td}>
                      <span className={badge(r.exemplar?.estado)}>
                        {r.exemplar?.estado || "—"}
                      </span>
                    </td>
                    <td className={table.td}>
                      <span className={badge(r.status)}>{r.status}</span>
                    </td>
                    <td className={table.td}>{r.expiraEm}</td>
                    <td className={table.td}>
                      <div className={table.actions}>
                        {r.status === "ATIVA" && ehAdmin && (
                          <button
                            className={btn("primary", "sm")}
                            onClick={() => setModalConcluir(r)}
                          >
                            Criar Empréstimo
                          </button>
                        )}
                        {r.status === "ATIVA" && (
                          <button
                            className={btn("danger", "sm")}
                            onClick={() =>
                              setConfirmAction({
                                type: "cancelar",
                                id: r.id,
                                titulo: "Cancelar Reserva",
                                msg: ehAdmin
                                  ? "Cancelar esta reserva?"
                                  : "Cancelar sua reserva?",
                              })
                            }
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      <Modal
        aberto={!!modalConcluir}
        fechar={() => setModalConcluir(null)}
        titulo="Criar Empréstimo"
      >
        {modalConcluir && (
          <div>
            <p className={emprestimoDashboard.modalInfo}>
              <span className={emprestimoDashboard.modalInfoStrong}>
                Usuário:
              </span>{" "}
              {modalConcluir.user?.nome}
            </p>
            <p className={emprestimoDashboard.modalInfo}>
              <span className={emprestimoDashboard.modalInfoStrong}>
                Livro:
              </span>{" "}
              {modalConcluir.livro?.titulo}
            </p>
            <p className={emprestimoDashboard.modalInfo + " mb-4"}>
              <span className={emprestimoDashboard.modalInfoStrong}>
                Exemplar:
              </span>{" "}
              {modalConcluir.exemplar?.estado}
            </p>
            <div className={form.group}>
              <label className={form.label}>Dias de empréstimo</label>
              <input
                type="number"
                min="1"
                defaultValue={14}
                onChange={(e) => setDiasEmprestimo(Number(e.target.value))}
                className={form.input}
              />
            </div>
            <div className={form.actions}>
              <button
                className={btn("secondary")}
                onClick={() => setModalConcluir(null)}
              >
                Cancelar
              </button>
              <button
                className={btn("primary")}
                onClick={() => {
                  setModalConcluir(null);
                  concluirReservaMutation.mutate({
                    id: modalConcluir.id,
                    dias: diasEmprestimo,
                  });
                }}
                disabled={concluirReservaMutation.isPending}
              >
                {concluirReservaMutation.isPending ? "Criando..." : "Confirmar"}
              </button>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        aberto={modalEmprestimo}
        fechar={() => {
          setModalEmprestimo(false);
          setMsg("");
          setUserSelecionado(null);
          setExemplarSelecionado(null);
          setBuscaUser("");
          setBuscaLivro("");
        }}
        titulo="Novo Empréstimo"
      >
        <div className={form.group}>
          <label className={form.label}>Buscar usuário</label>
          <div className="flex gap-2 items-center">
            <FiSearch size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Nome ou email..."
              value={buscaUser}
              onChange={(e) => {
                setBuscaUser(e.target.value);
                setUserSelecionado(null);
              }}
              className={form.input}
            />
          </div>
          {usuariosBusca && usuariosBusca.length > 0 && !userSelecionado && (
            <ul className={dropdown.list}>
              {usuariosBusca.map((u) => (
                <li
                  key={u.id}
                  className={dropdown.item}
                  onClick={() => {
                    setUserSelecionado(u);
                    setBuscaUser(u.nome);
                  }}
                >
                  <strong>{u.nome}</strong> — {u.email}
                  <span className={badge(u.nivel_perfil) + " ml-2"}>
                    {u.nivel_perfil}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {userSelecionado && (
            <div className={dropdown.selected}>
              ✓ {userSelecionado.nome} ({userSelecionado.email})
            </div>
          )}
        </div>
        <div className={form.group}>
          <label className={form.label}>Buscar livro</label>
          <div className="flex gap-2 items-center">
            <FiSearch size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Título, autor..."
              value={buscaLivro}
              onChange={(e) => {
                setBuscaLivro(e.target.value);
                setExemplarSelecionado(null);
              }}
              className={form.input}
            />
          </div>
          {livrosBusca && livrosBusca.length > 0 && !exemplarSelecionado && (
            <ul className={dropdown.list}>
              {livrosBusca.map((l) => {
                const disponiveis =
                  l.exemplares?.filter((e) => e.disponivel && !e.vendido) || [];
                if (disponiveis.length === 0)
                  return (
                    <li
                      key={l.id}
                      className={`${dropdown.item} ${dropdown.disabled}`}
                    >
                      {l.titulo} — sem exemplares disponíveis
                    </li>
                  );
                return disponiveis.map((ex) => (
                  <li
                    key={ex.id}
                    className={dropdown.item}
                    onClick={() => {
                      setExemplarSelecionado({ ...ex, livroTitulo: l.titulo });
                      setBuscaLivro(l.titulo);
                    }}
                  >
                    <strong>{l.titulo}</strong> —{" "}
                    <span className={badge(ex.estado)}>{ex.estado}</span>
                  </li>
                ));
              })}
            </ul>
          )}
          {exemplarSelecionado && (
            <div className={dropdown.selected}>
              ✓ {exemplarSelecionado.livroTitulo} — {exemplarSelecionado.estado}
            </div>
          )}
        </div>

        <div className={form.group}>
          <label className={form.label}>Dias de empréstimo</label>
          <input
            type="number"
            min="1"
            value={diasEmprestimo}
            onChange={(e) => setDiasEmprestimo(Number(e.target.value))}
            className={form.input}
          />
        </div>

        <div className={form.actions}>
          <button
            className={btn("secondary")}
            onClick={() => {
              setModalEmprestimo(false);
              setMsg("");
            }}
          >
            Cancelar
          </button>
          <button
            className={btn("primary")}
            onClick={handleCriarEmprestimo}
            disabled={criarEmprestimoMutation.isPending}
          >
            {criarEmprestimoMutation.isPending
              ? "Criando..."
              : "Criar Empréstimo"}
          </button>
        </div>
        {msg && <p className={form.error + " text-center mt-3"}>{msg}</p>}
      </Modal>
      <Modal
        aberto={!!modalDevolucao}
        fechar={() => setModalDevolucao(null)}
        titulo="Devolver Livro"
      >
        {modalDevolucao && (
          <div>
            <p className={emprestimoDashboard.modalInfo}>
              <span className={emprestimoDashboard.modalInfoStrong}>
                Usuário:
              </span>{" "}
              {modalDevolucao.usuario?.nome || "—"}
            </p>
            <p className={emprestimoDashboard.modalInfo}>
              <span className={emprestimoDashboard.modalInfoStrong}>
                Livro:
              </span>{" "}
              {modalDevolucao.exemplar?.livro?.titulo || "—"}
            </p>
            <p className={emprestimoDashboard.modalInfo + " mb-4"}>
              <span className={emprestimoDashboard.modalInfoStrong}>
                Estado atual do exemplar:
              </span>{" "}
              <span className={badge(modalDevolucao.exemplar?.estado)}>
                {modalDevolucao.exemplar?.estado || "—"}
              </span>
            </p>
            <div className={form.group}>
              <label className={form.label}>Como está o livro?</label>
              {(() => {
                const hierarquia = { NOVO: 4, OTIMO: 3, BOM: 2, USADO: 1 };
                const estadoAtual = modalDevolucao.exemplar?.estado || "NOVO";
                const ehDev = user?.nivel_perfil === "DEV";
                const opcoes = ehDev
                  ? ["NOVO", "OTIMO", "BOM", "USADO"]
                  : ["NOVO", "OTIMO", "BOM", "USADO"].filter(
                      (e) => hierarquia[e] <= hierarquia[estadoAtual],
                    );

                return (
                  <select
                    value={estadoDevolucao}
                    onChange={(e) => setEstadoDevolucao(e.target.value)}
                    className={form.select}
                  >
                    {opcoes.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                );
              })()}
            </div>
            <div className={form.actions}>
              <button
                className={btn("secondary")}
                onClick={() => setModalDevolucao(null)}
              >
                Cancelar
              </button>
              <button
                className={btn("primary")}
                onClick={() =>
                  devolverMutation.mutate({
                    id: modalDevolucao.id,
                    estado: estadoDevolucao,
                  })
                }
                disabled={devolverMutation.isPending}
              >
                {devolverMutation.isPending
                  ? "Devolvendo..."
                  : "Confirmar Devolução"}
              </button>
            </div>
          </div>
        )}
      </Modal>
      <Confirm
        aberto={!!confirmAction}
        fechar={() => setConfirmAction(null)}
        confirmar={() => {
          if (confirmAction.type === "cancelar")
            cancelarReservaMutation.mutate(confirmAction.id);
        }}
        titulo={confirmAction?.titulo || ""}
        mensagem={confirmAction?.msg || ""}
        variant={confirmAction?.type === "cancelar" ? "danger" : "warning"}
        confirmText="Cancelar Reserva"
      />
    </div>
  );
}
