export const theme = {
  page: "max-w-[1200px]",
  pageHeader: "flex items-center justify-between mb-6 flex-wrap gap-3",
  pageTitle: "text-2xl font-bold text-dark-100",
  pageSubtitle: "text-sm text-dark-300",

  appLayout: "flex min-h-screen bg-dark-900",
  backdrop: "fixed inset-0 bg-black/60 backdrop-blur-sm z-40",
  mainContent: "flex-1 transition-all duration-300 p-6 flex justify-center",

  stateLoading: "flex items-center justify-center py-12 text-dark-300 text-sm",
  stateEmpty: "flex items-center justify-center py-12 text-dark-400 text-sm",
  stateError: "flex items-center justify-center py-12 text-red-400 text-sm",

  statsRow: "grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 mb-6",
  statCard:
    "bg-dark-800 border border-dark-600 rounded-xl p-5 shadow-lg shadow-black/20",
  statLabel:
    "text-xs font-semibold uppercase tracking-wider text-dark-300 mb-1",
  statValue: "text-2xl font-bold text-dark-100",

  errorPage: "min-h-screen bg-dark-900 flex items-center justify-center p-5",
  errorContent: "text-center",
  errorCode: "text-6xl font-bold text-dark-500 mb-4",
  errorTitle: "text-xl font-semibold text-dark-200 mb-2",
  errorMsg: "text-sm text-dark-300 mb-6",

  loginPage: "min-h-screen bg-dark-900 flex items-center justify-center p-5",
  loginCard:
    "bg-dark-800 border border-dark-600 rounded-xl shadow-lg shadow-black/30 p-8 w-full max-w-sm",
  loginTitle: "text-2xl font-bold text-glow-400 text-center mb-1",
  loginSubtitle: "text-sm text-dark-300 text-center mb-6",

  userInfo: "px-3 py-2.5 border-b border-dark-600 shrink-0",
  userName: "text-sm font-semibold text-dark-100",
  userRole:
    "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border mt-1",

  topbar:
    "flex items-center justify-between mb-6 pb-4 border-b border-dark-600",
  topbarLeft: "text-sm text-dark-300",
  topbarRight: "flex items-center gap-3",
  topbarName: "text-sm font-medium text-dark-200",
  topbarRole:
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border",
  topbarRoleDEV:
    "bg-glow-600/15 text-glow-300 border-glow-600/40 shadow-[0_0_12px_rgba(139,92,246,0.2)]",
  topbarRoleBIBLIOTECARIO:
    "bg-cyan-bg text-cyan-400 border-cyan-border shadow-[0_0_12px_rgba(6,182,212,0.2)]",
  topbarRoleLEITOR:
    "bg-emerald-bg text-emerald-400 border-emerald-border shadow-[0_0_12px_rgba(16,185,129,0.2)]",
};
