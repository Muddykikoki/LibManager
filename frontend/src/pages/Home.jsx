import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/api";
import Busca from "../components/Busca";
import LivroCard from "../components/LivroCard";
import LivroDetalhe from "../components/LivroDetalhe";
import ExemplarAcoes from "../components/ExemplarAcoes";
import Modal from "../components/Modal";
import { theme } from "../styles/theme";
import { livroCard } from "../styles/components";

export default function Home() {
  const [termoBusca, setTermoBusca] = useState("");
  const [livroSelecionado, setLivroSelecionado] = useState(null);

  const { data: livros, isLoading } = useQuery({
    queryKey: ["livros", termoBusca],
    queryFn: async () => {
      if (termoBusca.trim()) {
        const { data } = await api.get(
          `/livro/encontrar?q=${encodeURIComponent(termoBusca)}`,
          { params: { t: Date.now() } },
        );
        return data;
      }
      const { data } = await api.get("/livro/", { params: { t: Date.now() } });
      return data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const { data: minhasReservas } = useQuery({
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

  function jaReservado(livroId) {
    return minhasReservas?.some(
      (r) => r.livroId === livroId && r.status === "ATIVA",
    );
  }

  return (
    <div className={theme.page}>
      <div className={theme.pageHeader}>
        <h1 className={theme.pageTitle}>Catálogo</h1>
      </div>
      <div className="mb-6">
        <Busca onBuscar={setTermoBusca} />
      </div>

      {isLoading && <div className={theme.stateLoading}>Carregando...</div>}

      <div className={livroCard.grid}>
        {livros?.map((livro) => (
          <LivroCard
            key={livro.id}
            livro={livro}
            onClick={setLivroSelecionado}
          />
        ))}
      </div>

      {livros?.length === 0 && !isLoading && (
        <div className={theme.stateEmpty}>Nenhum livro encontrado</div>
      )}

      <Modal
        aberto={!!livroSelecionado}
        fechar={() => setLivroSelecionado(null)}
        titulo={livroSelecionado?.titulo || ""}
      >
        {livroSelecionado && (
          <>
            <LivroDetalhe livro={livroSelecionado} />
            <ExemplarAcoes
              livro={livroSelecionado}
              jaReservado={jaReservado(livroSelecionado.id)}
            />
          </>
        )}
      </Modal>
    </div>
  );
}
