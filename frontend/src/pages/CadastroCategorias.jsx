import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiPlus, FiEdit2 } from "react-icons/fi";
import api from "../api/api";
import Modal from "../components/Modal";
import Confirm from "../components/Confirm";
import { useToast } from "../components/Toast";
import { theme } from "../styles/theme";
import { table, btn, badge, form, chip } from "../styles/components";
import { dashboard } from "../styles/dashboard";

export default function CadastroCategorias() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [modalAberto, setModalAberto] = useState(false);
  const [modalEditar, setModalEditar] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formState, setFormState] = useState({
    nome: "",
    categoriasBaseIds: [],
  });
  const [formEditar, setFormEditar] = useState({
    nome: "",
    categoriasBaseIds: [],
  });
  const [erro, setErro] = useState("");

  const { data: categorias, isLoading } = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => {
      const { data } = await api.get("/categoria/", {
        params: { t: Date.now() },
      });
      const bases = data
        .filter((c) => !c.categoriasBase || c.categoriasBase.length === 0)
        .sort((a, b) => a.nome.localeCompare(b.nome));
      const compostas = data
        .filter((c) => c.categoriasBase && c.categoriasBase.length > 0)
        .sort((a, b) => a.nome.localeCompare(b.nome));
      return [...bases, ...compostas];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const deletarMutation = useMutation({
    mutationFn: (id) => api.delete(`/categoria/deletar/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      toast.success("Categoria deletada", "A categoria foi removida.");
    },
    onError: (err) => {
      toast.error(
        "Erro ao deletar",
        err.response?.data?.error || "Tente novamente.",
      );
    },
  });
  const editarMutation = useMutation({
    mutationFn: ({ id, dados }) => api.put(`/categoria/editar/${id}`, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      setModalEditar(null);
      setErro("");
      toast.success("Categoria atualizada", "Dados atualizados com sucesso.");
    },
    onError: (err) => {
      setErro(err.response?.data?.error || "Erro ao atualizar");
      toast.error(
        "Erro ao atualizar",
        err.response?.data?.error || "Tente novamente.",
      );
    },
  });
  function handleBaseToggle(id) {
    setFormState((prev) => ({
      ...prev,
      categoriasBaseIds: prev.categoriasBaseIds.includes(id)
        ? prev.categoriasBaseIds.filter((c) => c !== id)
        : [...prev.categoriasBaseIds, id],
    }));
  }
  function abrirEditar(categoria) {
    setFormEditar({
      nome: categoria.nome,
      categoriasBaseIds: categoria.categoriasBase?.map((b) => b.id) || [],
    });
    setErro("");
    setModalEditar(categoria);
  }

  function handleEditarBaseToggle(id) {
    setFormEditar((prev) => ({
      ...prev,
      categoriasBaseIds: prev.categoriasBaseIds.includes(id)
        ? prev.categoriasBaseIds.filter((c) => c !== id)
        : [...prev.categoriasBaseIds, id],
    }));
  }

  function handleEditarSubmit(e) {
    e.preventDefault();
    setErro("");
    editarMutation.mutate({
      id: modalEditar.id,
      dados: {
        nome: formEditar.nome,
        categoriasBaseIds: formEditar.categoriasBaseIds,
      },
    });
  }

  const criarMutation = useMutation({
    mutationFn: async (dados) => {
      const { data: novaCategoria } = await api.post("/categoria/cadastrar", {
        nome: dados.nome,
      });

      if (dados.categoriasBaseIds?.length > 0) {
        await api.post("/categoria/sub-categoria", {
          id: novaCategoria.id,
          categoriasBaseIds: dados.categoriasBaseIds,
        });
      }

      return novaCategoria;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      setModalAberto(false);
      setFormState({ nome: "", categoriasBaseIds: [] });
      setErro("");
      toast.success("Categoria criada", "Cadastro realizado com sucesso.");
    },
    onError: (err) => {
      setErro(err.response?.data?.error || "Erro ao criar categoria");
      toast.error("Erro", err.response?.data?.error || "Tente novamente.");
    },
  });
  function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    criarMutation.mutate({
      nome: formState.nome,
      categoriasBaseIds: formState.categoriasBaseIds,
    });
  }

  return (
    <div className={dashboard.container}>
      <div className={dashboard.header}>
        <h1 className={dashboard.title}>Categorias</h1>
        <button
          className={btn("primary")}
          onClick={() => {
            setModalAberto(true);
            setErro("");
          }}
        >
          <FiPlus size={18} /> Nova Categoria
        </button>
      </div>

      {isLoading && <div className={theme.stateLoading}>Carregando...</div>}

      {categorias && (
        <div className={table.card}>
          <table className={table.table}>
            <thead className={table.thead}>
              <tr>
                <th className={table.th}>Nome</th>
                <th className={table.th}>Tipo</th>
                <th className={table.th}>Categorias Base</th>
                <th className={table.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categorias.length === 0 ? (
                <tr>
                  <td className={table.td} colSpan="4">
                    <div className={theme.stateEmpty}>
                      Nenhuma categoria cadastrada
                    </div>
                  </td>
                </tr>
              ) : (
                categorias.map((c) => (
                  <tr key={c.id} className={table.tr}>
                    <td className={table.td}>{c.nome}</td>
                    <td className={table.td}>
                      <span
                        className={badge(
                          c.categoriasBase?.length > 0 ? "DEV" : "LEITOR",
                        )}
                      >
                        {c.categoriasBase?.length > 0 ? "Composta" : "Base"}
                      </span>
                    </td>
                    <td className={table.td}>
                      {c.categoriasBase?.length > 0
                        ? c.categoriasBase.map((b) => (
                            <span
                              key={b.id}
                              className={badge("OTIMO") + " mr-1"}
                            >
                              {b.nome}
                            </span>
                          ))
                        : "—"}
                    </td>
                    <td className={table.td}>
                      <div className={table.actions}>
                        <button
                          className={btn("secondary", "sm")}
                          onClick={() => abrirEditar(c)}
                        >
                          <FiEdit2 size={14} /> Editar
                        </button>
                        <button
                          className={btn("danger", "sm")}
                          onClick={() =>
                            setConfirmDelete({ id: c.id, nome: c.nome })
                          }
                        >
                          Deletar
                        </button>
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
        aberto={modalAberto}
        fechar={() => {
          setModalAberto(false);
          setErro("");
        }}
        titulo="Nova Categoria"
      >
        <form onSubmit={handleSubmit}>
          <div className={form.group}>
            <label className={form.label}>Nome</label>
            <input
              type="text"
              value={formState.nome}
              onChange={(e) =>
                setFormState({ ...formState, nome: e.target.value })
              }
              required
              className={form.input}
            />
          </div>

          <div className={form.group}>
            <label className={form.label}>
              Categorias Base (opcional — para criar composta)
            </label>
            <div className={chip.group}>
              {categorias
                ?.filter((c) => c.categoriasBase?.length === 0)
                .map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`${chip.base} ${formState.categoriasBaseIds.includes(c.id) ? chip.selected : ""}`}
                    onClick={() => handleBaseToggle(c.id)}
                  >
                    {c.nome}
                  </button>
                ))}
            </div>
          </div>

          <div className={form.actions}>
            <button
              type="button"
              className={btn("secondary")}
              onClick={() => {
                setModalAberto(false);
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
        <form onSubmit={handleEditarSubmit}>
          <div className={form.group}>
            <label className={form.label}>Nome</label>
            <input
              type="text"
              value={formEditar.nome}
              onChange={(e) =>
                setFormEditar({ ...formEditar, nome: e.target.value })
              }
              required
              className={form.input}
            />
          </div>

          <div className={form.group}>
            <label className={form.label}>Categorias Base</label>
            <div className={chip.group}>
              {categorias
                ?.filter(
                  (c) =>
                    c.id !== modalEditar?.id && c.categoriasBase?.length === 0,
                )
                .map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`${chip.base} ${formEditar.categoriasBaseIds.includes(c.id) ? chip.selected : ""}`}
                    onClick={() => handleEditarBaseToggle(c.id)}
                  >
                    {c.nome}
                  </button>
                ))}
            </div>
          </div>

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
        titulo="Deletar Categoria"
        mensagem={`Tem certeza que deseja deletar "${confirmDelete?.nome}"? Livros vinculados perderão esta categoria.`}
        variant="danger"
        confirmText="Deletar"
      />
    </div>
  );
}
