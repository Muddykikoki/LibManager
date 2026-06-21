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
import { useAuth } from "../context/AuthContext";

export default function CadastroLivros() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { user } = useAuth();
  const [modalLivro, setModalLivro] = useState(false);
  const [modalEditarLivro, setModalEditarLivro] = useState(null);
  const [modalExemplar, setModalExemplar] = useState(false);
  const [livroParaExemplar, setLivroParaExemplar] = useState(null);
  const [estadoExemplar, setEstadoExemplar] = useState("NOVO");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [modalExemplares, setModalExemplares] = useState(null);
  const [editandoEstado, setEditandoEstado] = useState(null);
  const [formState, setFormState] = useState({
    titulo: "",
    autor: "",
    editora: "",
    ano: "",
    descricao: "",
    preco: "",
    categoriaIds: [],
  });
  const [erro, setErro] = useState("");

  const { data: livros, isLoading } = useQuery({
    queryKey: ["livros"],
    queryFn: async () => {
      const { data } = await api.get("/livro/", { params: { t: Date.now() } });
      return data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const { data: categorias } = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => {
      const { data } = await api.get("/categoria/", {
        params: { t: Date.now() },
      });
      return data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const criarLivroMutation = useMutation({
    mutationFn: (dados) => api.post("/livro/cadastrar", dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livros"] });
      setModalLivro(false);
      resetForm();
      toast.success("Livro criado", "O livro foi cadastrado.");
    },
    onError: (err) => {
      setErro(err.response?.data?.error || "Erro ao criar livro");
      toast.error("Erro", err.response?.data?.error || "Tente novamente.");
    },
  });

  const editarLivroMutation = useMutation({
    mutationFn: ({ id, dados }) => api.put(`/livro/editar/${id}`, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livros"] });
      setModalEditarLivro(null);
      resetForm();
      toast.success("Livro atualizado", "Dados atualizados com sucesso.");
    },
    onError: (err) => {
      setErro(err.response?.data?.error || "Erro ao atualizar");
      toast.error("Erro", err.response?.data?.error || "Tente novamente.");
    },
  });

  const deletarLivroMutation = useMutation({
    mutationFn: (id) => api.delete(`/livro/deletar/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livros"] });
      toast.success("Livro deletado", "O livro foi removido.");
    },
    onError: (err) => {
      toast.error(
        "Erro ao deletar",
        err.response?.data?.error || "Tente novamente.",
      );
    },
  });

  const criarExemplarMutation = useMutation({
    mutationFn: (dados) => api.post("/exemplar/cadastrar", dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livros"] });
      setModalExemplar(false);
      setLivroParaExemplar(null);
      setEstadoExemplar("NOVO");
      toast.success("Exemplar criado", "O exemplar foi adicionado.");
    },
    onError: (err) => {
      toast.error("Erro", err.response?.data?.error || "Tente novamente.");
    },
  });

  const atualizarEstadoMutation = useMutation({
    mutationFn: ({ id, estado }) =>
      api.put(`/exemplar/estado/${id}`, { estado }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["livros"] });
      if (modalExemplares) {
        const atualizado = queryClient
          .getQueryData(["livros"])
          ?.find((l) => l.id === modalExemplares.id);
        if (atualizado) setModalExemplares(atualizado);
      }
      setEditandoEstado(null);
      toast.success("Estado atualizado", "O estado do exemplar foi alterado.");
    },
    onError: (err) => {
      toast.error("Erro", err.response?.data?.error || "Tente novamente.");
    },
  });

  function resetForm() {
    setFormState({
      titulo: "",
      autor: "",
      editora: "",
      ano: "",
      descricao: "",
      preco: "",
      categoriaIds: [],
    });
    setErro("");
  }

  function handleChange(e) {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  }

  function handleCategoriaToggle(id) {
    setFormState((prev) => ({
      ...prev,
      categoriaIds: prev.categoriaIds.includes(id)
        ? prev.categoriaIds.filter((c) => c !== id)
        : [...prev.categoriaIds, id],
    }));
  }

  function handleSubmitCriar(e) {
    e.preventDefault();
    setErro("");
    if (formState.categoriaIds.length === 0) {
      setErro("Selecione pelo menos uma categoria");
      return;
    }
    criarLivroMutation.mutate({
      ...formState,
      ano: Number(formState.ano),
      preco: Number(formState.preco),
    });
  }

  function handleSubmitEditar(e) {
    e.preventDefault();
    setErro("");
    const dados = {};
    if (formState.titulo) dados.titulo = formState.titulo;
    if (formState.autor) dados.autor = formState.autor;
    if (formState.editora) dados.editora = formState.editora;
    if (formState.ano) dados.ano = Number(formState.ano);
    if (formState.preco) dados.preco = Number(formState.preco);
    if (formState.descricao !== undefined)
      dados.descricao = formState.descricao;
    if (formState.categoriaIds.length > 0)
      dados.categoriaIds = formState.categoriaIds;
    editarLivroMutation.mutate({ id: modalEditarLivro.id, dados });
  }

  function abrirEditar(livro) {
    setFormState({
      titulo: livro.titulo,
      autor: livro.autor,
      editora: livro.editora,
      ano: String(livro.ano),
      descricao: livro.descricao || "",
      preco: String(livro.preco),
      categoriaIds: livro.categoriaIds || [],
    });
    setErro("");
    setModalEditarLivro(livro);
  }

  function getContagemEstados(livro) {
    const ex = livro.exemplares?.filter((e) => !e.vendido) || [];
    const c = { NOVO: 0, OTIMO: 0, BOM: 0, USADO: 0 };
    ex.forEach((e) => {
      c[e.estado] = (c[e.estado] || 0) + 1;
    });
    return c;
  }

  const PRECO_ESTADO = { NOVO: 1.2, OTIMO: 1.0, BOM: 0.85, USADO: 0.5 };

  return (
    <div className={dashboard.container}>
      <div className={dashboard.header}>
        <h1 className={dashboard.title}>Livros</h1>
        <button
          className={btn("primary")}
          onClick={() => {
            resetForm();
            setModalLivro(true);
          }}
        >
          <FiPlus size={18} /> Novo Livro
        </button>
      </div>

      {isLoading && <div className={theme.stateLoading}>Carregando...</div>}

      {livros && (
        <div className={table.card}>
          <table className={table.table}>
            <thead className={table.thead}>
              <tr>
                <th className={table.th}>Título</th>
                <th className={table.th}>Preço</th>
                <th className={table.th}>Exemplares</th>
                <th className={table.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {livros.length === 0 ? (
                <tr>
                  <td className={table.td} colSpan="4">
                    <div className={theme.stateEmpty}>
                      Nenhum livro cadastrado
                    </div>
                  </td>
                </tr>
              ) : (
                livros.map((l) => {
                  const c = getContagemEstados(l);
                  const total = Object.values(c).reduce((a, b) => a + b, 0);
                  return (
                    <tr key={l.id} className={table.tr}>
                      <td className={table.td}>
                        <strong>{l.titulo}</strong>
                        <div className={table.sub}>
                          {l.autor} &bull; {l.editora} &bull; {l.ano}
                        </div>
                      </td>
                      <td className={table.td}>R$ {l.preco?.toFixed(2)}</td>
                      <td className={table.td}>
                        <div className="flex gap-1.5 flex-wrap">
                          {c.NOVO > 0 && (
                            <span className={badge("NOVO")}>
                              Novo: {c.NOVO}
                            </span>
                          )}
                          {c.OTIMO > 0 && (
                            <span className={badge("OTIMO")}>
                              Ótimo: {c.OTIMO}
                            </span>
                          )}
                          {c.BOM > 0 && (
                            <span className={badge("BOM")}>Bom: {c.BOM}</span>
                          )}
                          {c.USADO > 0 && (
                            <span className={badge("USADO")}>
                              Usado: {c.USADO}
                            </span>
                          )}
                          {total === 0 && (
                            <span className="text-xs text-dark-400">
                              Nenhum
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={table.td}>
                        <div className={table.actions}>
                          {total > 0 && (
                            <button
                              className={btn("secondary", "sm")}
                              onClick={() => setModalExemplares(l)}
                            >
                              Exemplares
                            </button>
                          )}
                          <button
                            className={btn("secondary", "sm")}
                            onClick={() => abrirEditar(l)}
                          >
                            <FiEdit2 size={14} /> Editar
                          </button>
                          <button
                            className={btn("primary", "sm")}
                            onClick={() => {
                              setLivroParaExemplar(l);
                              setEstadoExemplar("NOVO");
                              setErro("");
                              setModalExemplar(true);
                            }}
                          >
                            <FiPlus size={14} /> Exemplar
                          </button>
                          <button
                            className={btn("danger", "sm")}
                            onClick={() =>
                              setConfirmDelete({ id: l.id, titulo: l.titulo })
                            }
                          >
                            Deletar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
      <Modal
        aberto={modalLivro}
        fechar={() => {
          setModalLivro(false);
          setErro("");
        }}
        titulo="Novo Livro"
      >
        <form onSubmit={handleSubmitCriar}>
          <div className={form.group}>
            <label className={form.label}>Título</label>
            <input
              type="text"
              name="titulo"
              value={formState.titulo}
              onChange={handleChange}
              required
              className={form.input}
            />
          </div>
          <div className={form.group}>
            <label className={form.label}>Autor</label>
            <input
              type="text"
              name="autor"
              value={formState.autor}
              onChange={handleChange}
              required
              className={form.input}
            />
          </div>
          <div className={form.group}>
            <label className={form.label}>Editora</label>
            <input
              type="text"
              name="editora"
              value={formState.editora}
              onChange={handleChange}
              required
              className={form.input}
            />
          </div>
          <div className={form.group}>
            <label className={form.label}>Ano</label>
            <input
              type="number"
              name="ano"
              value={formState.ano}
              onChange={handleChange}
              required
              className={form.input}
            />
          </div>
          <div className={form.group}>
            <label className={form.label}>Preço (R$)</label>
            <input
              type="number"
              step="0.01"
              name="preco"
              value={formState.preco}
              onChange={handleChange}
              required
              className={form.input}
            />
          </div>
          <div className={form.group}>
            <label className={form.label}>Descrição</label>
            <textarea
              name="descricao"
              value={formState.descricao}
              onChange={handleChange}
              className={form.textarea}
            />
          </div>
          <div className={form.group}>
            <label className={form.label}>Categorias</label>
            <div className={chip.group}>
              {categorias?.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`${chip.base} ${formState.categoriaIds.includes(c.id) ? chip.selected : ""}`}
                  onClick={() => handleCategoriaToggle(c.id)}
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
                setModalLivro(false);
                setErro("");
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={btn("primary")}
              disabled={criarLivroMutation.isPending}
            >
              {criarLivroMutation.isPending ? "Criando..." : "Criar"}
            </button>
          </div>
          {erro && <p className={form.error + " text-center mt-3"}>{erro}</p>}
        </form>
      </Modal>
      <Modal
        aberto={!!modalEditarLivro}
        fechar={() => {
          setModalEditarLivro(null);
          setErro("");
        }}
        titulo={`Editar — ${modalEditarLivro?.titulo || ""}`}
      >
        <form onSubmit={handleSubmitEditar}>
          <div className={form.group}>
            <label className={form.label}>Título</label>
            <input
              type="text"
              name="titulo"
              value={formState.titulo}
              onChange={handleChange}
              required
              className={form.input}
            />
          </div>
          <div className={form.group}>
            <label className={form.label}>Autor</label>
            <input
              type="text"
              name="autor"
              value={formState.autor}
              onChange={handleChange}
              required
              className={form.input}
            />
          </div>
          <div className={form.group}>
            <label className={form.label}>Editora</label>
            <input
              type="text"
              name="editora"
              value={formState.editora}
              onChange={handleChange}
              required
              className={form.input}
            />
          </div>
          <div className={form.group}>
            <label className={form.label}>Ano</label>
            <input
              type="number"
              name="ano"
              value={formState.ano}
              onChange={handleChange}
              required
              className={form.input}
            />
          </div>
          <div className={form.group}>
            <label className={form.label}>Preço (R$)</label>
            <input
              type="number"
              step="0.01"
              name="preco"
              value={formState.preco}
              onChange={handleChange}
              required
              className={form.input}
            />
          </div>
          <div className={form.group}>
            <label className={form.label}>Descrição</label>
            <textarea
              name="descricao"
              value={formState.descricao}
              onChange={handleChange}
              className={form.textarea}
            />
          </div>
          <div className={form.group}>
            <label className={form.label}>Categorias</label>
            <div className={chip.group}>
              {categorias?.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`${chip.base} ${formState.categoriaIds.includes(c.id) ? chip.selected : ""}`}
                  onClick={() => handleCategoriaToggle(c.id)}
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
                setModalEditarLivro(null);
                setErro("");
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={btn("primary")}
              disabled={editarLivroMutation.isPending}
            >
              {editarLivroMutation.isPending ? "Salvando..." : "Salvar"}
            </button>
          </div>
          {erro && <p className={form.error + " text-center mt-3"}>{erro}</p>}
        </form>
      </Modal>
      <Modal
        aberto={modalExemplar}
        fechar={() => {
          setModalExemplar(false);
          setErro("");
        }}
        titulo={`Novo Exemplar — ${livroParaExemplar?.titulo || ""}`}
      >
        <div className={form.group}>
          <label className={form.label}>Estado do exemplar</label>
          <select
            value={estadoExemplar}
            onChange={(e) => setEstadoExemplar(e.target.value)}
            className={form.select}
          >
            <option value="NOVO">Novo (120%)</option>
            <option value="OTIMO">Ótimo (100%)</option>
            <option value="BOM">Bom (85%)</option>
            <option value="USADO">Usado (50%)</option>
          </select>
        </div>
        <p className="text-sm text-dark-300 mb-4">
          Preço base: R$ {livroParaExemplar?.preco?.toFixed(2)} → Preço: R${" "}
          {(livroParaExemplar?.preco * PRECO_ESTADO[estadoExemplar])?.toFixed(
            2,
          )}
        </p>
        <div className={form.actions}>
          <button
            type="button"
            className={btn("secondary")}
            onClick={() => {
              setModalExemplar(false);
              setErro("");
            }}
          >
            Cancelar
          </button>
          <button
            className={btn("primary")}
            onClick={() =>
              criarExemplarMutation.mutate({
                livroId: livroParaExemplar.id,
                estado: estadoExemplar,
              })
            }
            disabled={criarExemplarMutation.isPending}
          >
            {criarExemplarMutation.isPending ? "Criando..." : "Criar Exemplar"}
          </button>
        </div>
        {erro && <p className={form.error + " text-center mt-3"}>{erro}</p>}
      </Modal>
      <Modal
        aberto={!!modalExemplares}
        fechar={() => {
          setModalExemplares(null);
          setEditandoEstado(null);
        }}
        titulo={`Exemplares — ${modalExemplares?.titulo || ""}`}
      >
        {modalExemplares && (
          <div>
            {(() => {
              const exemplares = (modalExemplares.exemplares || []).filter(
                (e) => !e.vendido,
              );
              if (exemplares.length === 0) {
                return (
                  <p className="text-sm text-dark-400">
                    Nenhum exemplar cadastrado
                  </p>
                );
              }
              return (
                <div className={table.card}>
                  <table className={table.table}>
                    <thead className={table.thead}>
                      <tr>
                        <th className={table.th}>#</th>
                        <th className={table.th}>Estado</th>
                        <th className={table.th}>Situação</th>
                        {user?.nivel_perfil === "DEV" && (
                          <th className={table.th}>Ações</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {exemplares.map((ex, i) => (
                        <tr key={ex.id} className={table.tr}>
                          <td className={table.td}>{i + 1}</td>
                          <td className={table.td}>
                            {editandoEstado === ex.id ? (
                              <select
                                defaultValue={ex.estado}
                                className={form.select}
                                onChange={(e) => {
                                  atualizarEstadoMutation.mutate({
                                    id: ex.id,
                                    estado: e.target.value,
                                  });
                                }}
                              >
                                <option value="NOVO">NOVO</option>
                                <option value="OTIMO">ÓTIMO</option>
                                <option value="BOM">BOM</option>
                                <option value="USADO">USADO</option>
                              </select>
                            ) : (
                              <span className={badge(ex.estado)}>
                                {ex.estado}
                              </span>
                            )}
                          </td>
                          <td className={table.td}>
                            <span
                              className={badge(
                                ex.disponivel ? "DEVOLVIDO" : "EMPRESTADO",
                              )}
                            >
                              {ex.disponivel ? "Disponível" : "Emprestado"}
                            </span>
                          </td>
                          {user?.nivel_perfil === "DEV" && (
                            <td className={table.td}>
                              {editandoEstado === ex.id ? (
                                <button
                                  className={btn("danger", "sm")}
                                  onClick={() => setEditandoEstado(null)}
                                >
                                  Cancelar
                                </button>
                              ) : (
                                <button
                                  className={btn("secondary", "sm")}
                                  onClick={() => setEditandoEstado(ex.id)}
                                >
                                  <FiEdit2 size={14} /> Alterar
                                </button>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}
            <div className={form.actions + " mt-4"}>
              <button
                className={btn("secondary")}
                onClick={() => {
                  setModalExemplares(null);
                  setEditandoEstado(null);
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </Modal>
      <Confirm
        aberto={!!confirmDelete}
        fechar={() => setConfirmDelete(null)}
        confirmar={() => deletarLivroMutation.mutate(confirmDelete.id)}
        titulo="Deletar Livro"
        mensagem={`Tem certeza que deseja deletar "${confirmDelete?.titulo}"? Todos os exemplares vinculados também serão removidos.`}
        variant="danger"
        confirmText="Deletar"
      />
    </div>
  );
}
