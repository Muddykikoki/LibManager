import { table, badge } from "../styles/components";

const PRECO_ESTADO = { NOVO: 1.2, OTIMO: 1.0, BOM: 0.85, USADO: 0.5 };

export default function LivroDetalhe({ livro }) {
  const exemplares = livro.exemplares?.filter((e) => !e.vendido) || [];

  return (
    <div>
      <div className="mb-5 space-y-2 text-sm">
        <div className="flex gap-2">
          <span className="text-dark-400 w-20 shrink-0">Autor</span>
          <span className="text-dark-100 font-medium">{livro.autor}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-dark-400 w-20 shrink-0">Editora</span>
          <span className="text-dark-100 font-medium">{livro.editora}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-dark-400 w-20 shrink-0">Ano</span>
          <span className="text-dark-100 font-medium">{livro.ano}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-dark-400 w-20 shrink-0">Preço base</span>
          <span className="text-dark-100 font-medium">
            R$ {livro.preco?.toFixed(2)}
          </span>
        </div>
        {livro.descricao && (
          <div className="flex gap-2">
            <span className="text-dark-400 w-20 shrink-0">Descrição</span>
            <span className="text-dark-200">{livro.descricao}</span>
          </div>
        )}
        <div className="flex gap-2 items-start">
          <span className="text-dark-400 w-20 shrink-0">Categorias</span>
          <div className="flex flex-wrap gap-1.5">
            {livro.categorias?.map((c) => (
              <span key={c.id} className={badge("OTIMO")}>
                {c.nome}
              </span>
            ))}
          </div>
        </div>
      </div>

      <h3 className="text-base font-semibold text-dark-100 mb-3">Exemplares</h3>
      {exemplares.length === 0 ? (
        <p className="text-sm text-dark-400 text-center py-6">
          Nenhum exemplar cadastrado
        </p>
      ) : (
        <div className={table.card}>
          <table className={table.table}>
            <thead className={table.thead}>
              <tr>
                <th className={table.th}>Estado</th>
                <th className={table.th}>Preço</th>
                <th className={table.th}>Disponível</th>
              </tr>
            </thead>
            <tbody>
              {exemplares.map((ex) => (
                <tr key={ex.id} className={table.tr}>
                  <td className={table.td}>
                    <span className={badge(ex.estado)}>{ex.estado}</span>
                  </td>
                  <td className={table.td}>
                    R$ {(livro.preco * PRECO_ESTADO[ex.estado]).toFixed(2)}
                  </td>
                  <td className={table.td}>
                    <span className={badge(String(ex.disponivel))}>
                      {ex.disponivel ? "Sim" : "Emprestado"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
