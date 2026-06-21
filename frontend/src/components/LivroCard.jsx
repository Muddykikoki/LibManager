import { livroCard, badge } from "../styles/components";

const PRECO_ESTADO = { NOVO: 1.2, OTIMO: 1.0, BOM: 0.85, USADO: 0.5 };

export default function LivroCard({ livro, onClick }) {
  const exemplares = livro.exemplares || [];
  const disponiveis = exemplares.filter((e) => e.disponivel && !e.vendido);
  const temDisponivel = disponiveis.length > 0;

  function getMelhorPreco() {
    if (disponiveis.length === 0) return null;
    const melhorEstado = disponiveis.reduce(
      (melhor, ex) =>
        PRECO_ESTADO[ex.estado] < PRECO_ESTADO[melhor] ? ex.estado : melhor,
      disponiveis[0].estado,
    );
    return (livro.preco * PRECO_ESTADO[melhorEstado]).toFixed(2);
  }

  const preco = getMelhorPreco();

  return (
    <div className={livroCard.card} onClick={() => onClick(livro)}>
      <div>
        <p className={livroCard.title}>{livro.titulo}</p>
        <p className={livroCard.meta}>{livro.autor}</p>
        <p className={livroCard.metaSmall}>
          {livro.editora} &bull; {livro.ano}
        </p>
        <div className={livroCard.tags}>
          {livro.categorias?.slice(0, 3).map((c) => (
            <span key={c.id} className={badge("OTIMO")}>
              {c.nome}
            </span>
          ))}
        </div>
      </div>
      <div className={livroCard.footer}>
        <span
          className={
            temDisponivel
              ? "text-emerald-400 font-medium text-sm"
              : "text-red-400 font-medium text-sm"
          }
        >
          {temDisponivel
            ? `${disponiveis.length} disponível(is)`
            : "Indisponível"}
        </span>
        {preco && (
          <span className="font-bold text-glow-400 text-sm">R$ {preco}</span>
        )}
      </div>
    </div>
  );
}
