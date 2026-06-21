import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { search } from "../styles/components";

export default function Busca({ onBuscar }) {
  const [termo, setTermo] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onBuscar(termo);
  }

  return (
    <form className={search.bar} onSubmit={handleSubmit}>
      <FiSearch size={18} className="text-gray-400 shrink-0" />
      <input
        type="text"
        placeholder="Buscar por título, autor, editora, categoria..."
        value={termo}
        onChange={(e) => setTermo(e.target.value)}
        className={search.input}
      />
      <button type="submit" className={search.btn}>
        Buscar
      </button>
    </form>
  );
}
