import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiPlus, FiEdit2 } from "react-icons/fi";
import api from "../api/api";
import Modal from "../components/Modal";
import Confirm from "../components/Confirm";
import { useToast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import { theme } from "../styles/theme";
import { table, btn, badge, form } from "../styles/components";
import { dashboard } from "../styles/dashboard";

const PERFIS_DISPONIVEIS = {
  DEV: ["LEITOR", "BIBLIOTECARIO", "DEV"],
  BIBLIOTECARIO: ["LEITOR"],
};

export default function CadastroUsuarios() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { user } = useAuth();

  const [modalCriar, setModalCriar] = useState(false);
  const [modalEditar, setModalEditar] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formState, setFormState] = useState({
    nome: "",
    email: "",
    senha: "",
    nivel_perfil: "LEITOR",
  });
  const [erro, setErro] = useState("");

  const perfisDisponiveis = PERFIS_DISPONIVEIS[user?.nivel_perfil] || [
    "LEITOR",
  ];

  const { data: usuarios, isLoading } = useQuery({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const { data } = await api.get("/usuario/", {
        params: { t: Date.now() },
      });
      return data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const criarMutation = useMutation({
    mutationFn: (dados) => api.post("/usuario/criar", dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      setModalCriar(false);
      setFormState({ nome: "", email: "", senha: "", nivel_perfil: "LEITOR" });
      setErro("");
      toast.success("Usuário criado", "Cadastro realizado com sucesso.");
    },
    onError: (err) => {
      setErro(err.response?.data?.error || "Erro ao criar usuário");
      toast.error(
        "Erro ao criar",
        err.response?.data?.error || "Tente novamente.",
      );
    },
  });

  const editarMutation = useMutation({
    mutationFn: ({ id, dados }) => api.put(`/usuario/editar/${id}`, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      setModalEditar(null);
      setErro("");
      toast.success("Usuário atualizado", "Dados atualizados com sucesso.");
    },
    onError: (err) => {
      setErro(err.response?.data?.error || "Erro ao atualizar");
      toast.error(
        "Erro ao atualizar",
        err.response?.data?.error || "Tente novamente.",
      );
    },
  });

  const deletarMutation = useMutation({
    mutationFn: (id) => api.delete(`/usuario/deletar/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast.success("Usuário deletado", "O usuário foi removido.");
    },
    onError: (err) => {
      toast.error(
        "Erro ao deletar",
        err.response?.data?.error || "Tente novamente.",
      );
    },
  });

  function handleChange(e) {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  }

  function handleSubmitCriar(e) {
    e.preventDefault();
    setErro("");
    criarMutation.mutate(formState);
  }

  function handleSubmitEditar(e) {
    e.preventDefault();
    setErro("");
    const dados = {};
    if (formState.nome) dados.nome = formState.nome;
    if (formState.email) dados.email = formState.email;
    if (formState.senha) dados.senha = formState.senha;
    if (formState.nivel_perfil) dados.nivel_perfil = formState.nivel_perfil;
    editarMutation.mutate({ id: modalEditar.id, dados });
  }

  function abrirEditar(usuario) {
    setFormState({
      nome: usuario.nome,
      email: usuario.email,
      senha: "",
      nivel_perfil: usuario.nivel_perfil,
    });
    setErro("");
    setModalEditar(usuario);
  }

  function podeEditar(u) {
    if (user?.nivel_perfil === "DEV") return true;
    if (user?.nivel_perfil === "BIBLIOTECARIO" && u.nivel_perfil === "LEITOR")
      return true;
    return false;
  }

  function podeDeletar(u) {
    if (user?.nivel_perfil === "DEV") return true;
    if (user?.nivel_perfil === "BIBLIOTECARIO" && u.nivel_perfil === "LEITOR")
      return true;
    return false;
  }

  return (
    <div className={dashboard.container}>
      <div className={dashboard.header}>
        <h1 className={dashboard.title}>Usuários</h1>
        <button
          className={btn("primary")}
          onClick={() => {
            setModalCriar(true);
            setErro("");
            setFormState({
              nome: "",
              email: "",
              senha: "",
              nivel_perfil: "LEITOR",
            });
          }}
        >
          <FiPlus size={18} /> Novo Usuário
        </button>
      </div>

      {isLoading && <div className={theme.stateLoading}>Carregando...</div>}

      {usuarios && (
        <div className={table.card}>
          <table className={table.table}>
            <thead className={table.thead}>
              <tr>
                <th className={table.th}>Nome</th>
                <th className={table.th}>Email</th>
                <th className={table.th}>Perfil</th>
                <th className={table.th}>Moedas</th>
                <th className={table.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td className={table.td} colSpan="5">
                    <div className={theme.stateEmpty}>
                      Nenhum usuário cadastrado
                    </div>
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr key={u.id} className={table.tr}>
                    <td className={table.td}>{u.nome}</td>
                    <td className={table.td}>{u.email}</td>
                    <td className={table.td}>
                      <span className={badge(u.nivel_perfil)}>
                        {u.nivel_perfil}
                      </span>
                    </td>
                    <td className={table.td}>{u.moedas || 0}</td>
                    <td className={table.td}>
                      <div className={table.actions}>
                        {podeEditar(u) && (
                          <button
                            className={btn("secondary", "sm")}
                            onClick={() => abrirEditar(u)}
                          >
                            <FiEdit2 size={14} /> Editar
                          </button>
                        )}
                        {podeDeletar(u) && (
                          <button
                            className={btn("danger", "sm")}
                            onClick={() =>
                              setConfirmDelete({ id: u.id, nome: u.nome })
                            }
                          >
                            Deletar
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
        aberto={modalCriar}
        fechar={() => {
          setModalCriar(false);
          setErro("");
        }}
        titulo="Novo Usuário"
      >
        <form onSubmit={handleSubmitCriar}>
          <div className={form.group}>
            <label className={form.label}>Nome</label>
            <input
              type="text"
              name="nome"
              value={formState.nome}
              onChange={handleChange}
              required
              className={form.input}
            />
          </div>
          <div className={form.group}>
            <label className={form.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              required
              className={form.input}
            />
          </div>
          <div className={form.group}>
            <label className={form.label}>Senha</label>
            <input
              type="password"
              name="senha"
              value={formState.senha}
              onChange={handleChange}
              required
              className={form.input}
            />
          </div>
          <div className={form.group}>
            <label className={form.label}>Perfil</label>
            <select
              name="nivel_perfil"
              value={formState.nivel_perfil}
              onChange={handleChange}
              className={form.select}
            >
              {perfisDisponiveis.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className={form.actions}>
            <button
              type="button"
              className={btn("secondary")}
              onClick={() => {
                setModalCriar(false);
                setErro("");
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={btn("primary")}
              disabled={criarMutation.isPending}
            >
              {criarMutation.isPending ? "Criando..." : "Criar"}
            </button>
          </div>
          {erro && <p className={form.error + " text-center mt-3"}>{erro}</p>}
        </form>
      </Modal>
      <Modal
        aberto={!!modalEditar}
        fechar={() => {
          setModalEditar(null);
          setErro("");
        }}
        titulo={`Editar — ${modalEditar?.nome || ""}`}
      >
        <form onSubmit={handleSubmitEditar}>
          <div className={form.group}>
            <label className={form.label}>Nome</label>
            <input
              type="text"
              name="nome"
              value={formState.nome}
              onChange={handleChange}
              required
              className={form.input}
            />
          </div>
          <div className={form.group}>
            <label className={form.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              required
              className={form.input}
            />
          </div>
          <div className={form.group}>
            <label className={form.label}>
              Nova senha (deixe vazio para manter)
            </label>
            <input
              type="password"
              name="senha"
              value={formState.senha}
              onChange={handleChange}
              className={form.input}
            />
          </div>
          {user?.nivel_perfil === "DEV" && (
            <div className={form.group}>
              <label className={form.label}>Perfil</label>
              <select
                name="nivel_perfil"
                value={formState.nivel_perfil}
                onChange={handleChange}
                className={form.select}
              >
                {perfisDisponiveis.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className={form.actions}>
            <button
              type="button"
              className={btn("secondary")}
              onClick={() => {
                setModalEditar(null);
                setErro("");
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={btn("primary")}
              disabled={editarMutation.isPending}
            >
              {editarMutation.isPending ? "Salvando..." : "Salvar"}
            </button>
          </div>
          {erro && <p className={form.error + " text-center mt-3"}>{erro}</p>}
        </form>
      </Modal>
      <Confirm
        aberto={!!confirmDelete}
        fechar={() => setConfirmDelete(null)}
        confirmar={() => deletarMutation.mutate(confirmDelete.id)}
        titulo="Deletar Usuário"
        mensagem={`Tem certeza que deseja deletar "${confirmDelete?.nome}"? Esta ação não pode ser desfeita.`}
        variant="danger"
        confirmText="Deletar"
      />
    </div>
  );
}
