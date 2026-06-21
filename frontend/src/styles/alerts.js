export const confirm = {
  backdrop:
    "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[700] p-5",
  container:
    "bg-dark-800 border border-dark-600 rounded-xl shadow-2xl shadow-black/40 w-full max-w-[400px] flex flex-col",
  header: "px-5 py-4 border-b border-dark-600",
  title: "text-base font-semibold text-dark-100",
  body: "px-5 py-4 text-sm text-dark-300",
  footer: "flex gap-3 justify-end px-5 py-4 border-t border-dark-600",
  icon: "flex items-center justify-center w-10 h-10 rounded-full mb-3",
  iconDanger: "bg-red-bg",
  iconWarning: "bg-amber-bg",
  iconInfo: "bg-glow-600/10",
  iconSuccess: "bg-emerald-bg",
};

export const toast = {
  container:
    "fixed top-4 right-4 z-[800] flex flex-col gap-2 pointer-events-none",
  base: "pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg shadow-black/30 max-w-[380px] animate-[slideIn_0.25s_ease]",
  success: "bg-dark-800 border-emerald-border text-emerald-400",
  error: "bg-dark-800 border-red-border text-red-400",
  warning: "bg-dark-800 border-amber-border text-amber-400",
  info: "bg-dark-800 border-glow-600/30 text-glow-400",
  icon: "shrink-0 mt-0.5",
  text: "text-sm font-medium text-dark-100",
  subtext: "text-xs text-dark-300 mt-0.5",
  close:
    "shrink-0 ml-auto p-0.5 rounded text-dark-400 hover:text-dark-200 hover:bg-dark-700 transition-colors cursor-pointer",
  progressBar: "absolute bottom-0 left-0 h-0.5 rounded-b-lg",
  progressSuccess: "bg-emerald-500",
  progressError: "bg-red-500",
  progressWarning: "bg-amber-500",
  progressInfo: "bg-glow-500",
};
