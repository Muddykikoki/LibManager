const btnBase =
  "inline-flex items-center justify-center gap-1.5 px-4 py-2 border rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed";

const btnVariant = {
  primary:
    "bg-glow-600 text-white border-glow-600 hover:bg-glow-500 hover:border-glow-500 shadow-[0_0_12px_rgba(139,92,246,0.25)] hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]",
  secondary:
    "bg-dark-700 text-dark-200 border-dark-500 hover:bg-dark-600 hover:border-dark-400",
  danger:
    "bg-red-bg text-red-400 border-red-border hover:bg-red-600 hover:text-white hover:border-red-600",
  success:
    "bg-emerald-bg text-emerald-400 border-emerald-border hover:bg-emerald-600 hover:text-white hover:border-emerald-600",
  ghost:
    "bg-transparent text-dark-400 border-transparent hover:bg-dark-700 hover:text-dark-200",
};

const btnSize = {
  sm: "px-2.5 py-1.5 text-xs",
  xs: "px-2 py-1 text-[11px]",
};

export function btn(variant = "primary", size) {
  return `${btnBase} ${btnVariant[variant] || ""} ${size ? btnSize[size] || "" : ""}`.trim();
}

const badgeBase =
  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap";

const badgeVariant = {
  EMPRESTADO: "bg-amber-bg text-amber-400 border-amber-border",
  DEVOLVIDO: "bg-glow-600/10 text-glow-300 border-glow-600/30",
  ATRASADO: "bg-red-bg text-red-400 border-red-border",
  ATIVA: "bg-emerald-bg text-emerald-400 border-emerald-border",
  CONCLUIDA: "bg-emerald-bg text-emerald-400 border-emerald-border",
  EXPIRADA: "bg-dark-700 text-dark-300 border-dark-500",
  CANCELADA: "bg-dark-700 text-dark-300 border-dark-500",
  PENDENTE: "bg-amber-bg text-amber-400 border-amber-border",

  NOVO: "bg-glow-600/10 text-glow-300 border-glow-600/30",
  OTIMO: "bg-cyan-bg text-cyan-400 border-cyan-border",
  BOM: "bg-emerald-bg text-emerald-400 border-emerald-border",
  USADO: "bg-dark-700 text-dark-300 border-dark-500",

  DEV: "bg-glow-600/15 text-glow-300 border-glow-600/30",
  BIBLIOTECARIO: "bg-cyan-bg text-cyan-400 border-cyan-border",
  LEITOR: "bg-emerald-bg text-emerald-400 border-emerald-border",

  true: "bg-emerald-bg text-emerald-400 border-emerald-border",
  false: "bg-amber-bg text-amber-400 border-amber-border",
};

export function badge(status) {
  return `${badgeBase} ${badgeVariant[status] || badgeVariant.CANCELADA}`;
}

export const table = {
  card: "bg-dark-800 border border-dark-600 rounded-xl shadow-lg shadow-black/20 overflow-hidden",
  header:
    "flex items-center justify-between px-5 py-4 border-b border-dark-600 flex-wrap gap-3",
  body: "overflow-x-auto",
  table: "w-full border-collapse",
  thead: "bg-dark-700",
  th: "text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-dark-300 border-b border-dark-600 whitespace-nowrap",
  td: "px-4 py-3 text-sm text-dark-100 border-b border-dark-600",
  tr: "hover:bg-dark-700/50 transition-colors",
  sub: "text-xs text-dark-400 mt-0.5",
  actions: "flex gap-1.5 items-center",
};

export const form = {
  group: "mb-4",
  label: "block text-sm font-semibold text-dark-200 mb-1.5",
  input:
    "w-full px-3 py-2.5 bg-dark-700 border border-dark-500 rounded-lg text-sm text-dark-100 placeholder-dark-400 outline-none transition-all focus:border-glow-500 focus:ring-3 focus:ring-glow-glow",
  select:
    "w-full px-3 py-2.5 bg-dark-700 border border-dark-500 rounded-lg text-sm text-dark-100 outline-none transition-all focus:border-glow-500 focus:ring-3 focus:ring-glow-glow",
  textarea:
    "w-full px-3 py-2.5 bg-dark-700 border border-dark-500 rounded-lg text-sm text-dark-100 placeholder-dark-400 outline-none transition-all focus:border-glow-500 focus:ring-3 focus:ring-glow-glow resize-y min-h-[80px]",
  error: "text-red-400 text-xs mt-1.5",
  success: "text-emerald-400 text-xs mt-1.5",
  info: "text-glow-400 text-xs mt-1.5",
  actions: "flex gap-3 justify-end mt-6 pt-4 border-t border-dark-600",
};

export const chip = {
  group: "flex flex-wrap gap-2 mt-1",
  base: "inline-flex items-center px-3 py-1.5 border border-dark-500 rounded-full text-xs font-medium text-dark-300 bg-dark-700 cursor-pointer transition-all hover:border-glow-500 hover:text-glow-400",
  selected:
    "bg-glow-600 text-white border-glow-600 hover:bg-glow-500 hover:text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]",
};

export const tabs = {
  container: "flex gap-0 border-b-2 border-dark-600 mb-5",
  tab: "px-5 py-2.5 text-sm font-medium text-dark-400 bg-none border-none border-b-2 border-b-transparent -mb-0.5 cursor-pointer transition-all hover:text-dark-200",
  active: "text-glow-400 border-b-glow-500 font-semibold",
};

export const search = {
  bar: "flex items-center gap-2 bg-dark-700 border border-dark-500 rounded-lg px-3 transition-all focus-within:border-glow-500 focus-within:ring-3 focus-within:ring-glow-glow",
  input:
    "flex-1 border-none bg-transparent py-2.5 text-sm text-dark-100 placeholder-dark-400 outline-none",
  btn: "bg-glow-600 text-white border-none px-4 py-2 rounded-md text-xs font-medium cursor-pointer hover:bg-glow-500 transition-colors shadow-[0_0_10px_rgba(139,92,246,0.2)]",
};

export const dropdown = {
  list: "list-none mt-2 border border-dark-500 rounded-lg overflow-hidden max-h-[200px] overflow-y-auto bg-dark-700",
  item: "px-3.5 py-2.5 cursor-pointer border-b border-dark-600 transition-colors text-sm text-dark-200 hover:bg-glow-600/10 hover:text-glow-300",
  itemLast: "border-b-0",
  disabled: "text-dark-400 cursor-default italic hover:bg-transparent",
  selected:
    "flex items-center gap-2 mt-2 px-3 py-2 bg-emerald-bg border border-emerald-border rounded-lg text-sm text-emerald-400 font-medium",
};

export const modal = {
  backdrop:
    "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[600] p-5",
  container:
    "bg-dark-800 border border-dark-600 rounded-xl shadow-2xl shadow-black/40 w-full max-w-[520px] max-h-[85vh] flex flex-col",
  header:
    "flex items-center justify-between px-5 py-4 border-b border-dark-600",
  title: "text-base font-semibold text-dark-100",
  close:
    "p-1 rounded-md text-dark-400 hover:bg-dark-700 hover:text-dark-200 transition-colors cursor-pointer",
  body: "p-5 overflow-y-auto",
};

export const livroCard = {
  card: "bg-dark-800 border border-dark-600 rounded-xl shadow-lg shadow-black/20 p-5 cursor-pointer hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:border-glow-600 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between",
  title: "text-base font-semibold text-dark-100 mb-1",
  meta: "text-sm text-dark-300 mb-1",
  metaSmall: "text-xs text-dark-400 mb-2",
  tags: "flex flex-wrap gap-1 mb-3",
  footer:
    "flex items-center justify-between pt-3 border-t border-dark-600 text-sm",
  grid: "grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4",
};

export const exemplarAcoes = {
  container: "mt-4 pt-4 border-t border-dark-600",
  grupo: "mb-5",
  titulo: "text-sm font-semibold text-dark-100 mb-2.5",
  botoes: "flex gap-2 flex-wrap",
  compraCard:
    "bg-dark-700 border border-dark-500 rounded-lg p-3 flex flex-col items-center gap-2 min-w-[130px]",
};
