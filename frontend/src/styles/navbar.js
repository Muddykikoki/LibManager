export const navbar = {
  sidebar:
    "fixed left-0 top-0 bottom-0 bg-dark-800 border-r border-dark-600 flex flex-col transition-all duration-300 z-50 overflow-hidden",
  sidebarExpanded: "w-[250px]",
  sidebarCollapsed: "w-[68px]",

  header:
    "h-16 flex items-center justify-center px-4 border-b border-dark-600 shrink-0",
  logoFull: "text-xl font-bold text-dark-100 tracking-tight",
  logoMini: "text-lg font-bold text-glow-400",

  linksList: "flex-1 list-none p-3 overflow-y-auto space-y-1",
  link: "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-200",
  linkInactive: "text-dark-300 hover:bg-dark-700 hover:text-dark-100",
  linkActive:
    "bg-glow-600/15 text-glow-300 border-l-3 border-glow-500 rounded-l-none shadow-[0_0_12px_rgba(139,92,246,0.15)]",
  linkIcon: "flex items-center justify-center w-6 h-6 shrink-0",
  linkLabel: "truncate",

  submenuBtn:
    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-dark-300 hover:bg-dark-700 hover:text-dark-100 transition-colors duration-200 w-full text-left cursor-pointer",
  submenuArrow: "transition-transform duration-200 rotate-180",
  submenuList: "list-none pl-4 pt-1 space-y-1",
  submenuLink:
    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-200 border-l-2",
  submenuLinkInactive:
    "text-dark-300 border-dark-500 hover:border-glow-500 hover:text-dark-100",
  submenuLinkActive: "text-glow-300 border-glow-500 bg-dark-700/50",
  submenuCollapsedList: "list-none p-2 flex flex-col items-center gap-1",
  submenuCollapsedLink:
    "flex items-center justify-center p-2 rounded-lg transition-colors duration-200",
  submenuCollapsedLinkInactive:
    "text-dark-300 hover:bg-dark-700 hover:text-dark-100",
  submenuCollapsedLinkActive:
    "bg-glow-600/15 text-glow-300 border-l-3 border-glow-500",
  submenuArrowMini: "absolute bottom-0 right-2 text-dark-400",

  footer: "p-2 border-t border-dark-600 shrink-0 space-y-1",
  logoutBtn:
    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-bg transition-colors duration-200 w-full cursor-pointer",
  toggleBtn:
    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-dark-400 hover:bg-dark-700 hover:text-dark-200 transition-colors duration-200 w-full cursor-pointer",
};
