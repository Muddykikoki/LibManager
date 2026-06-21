import { useState, useEffect } from "react";
import { theme } from "../styles/theme";
import Navbar from "./Navbar";
import TopBar from "./TopBar";

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidth = isMobile ? 68 : collapsed ? 68 : 250;

  return (
    <div className={theme.appLayout}>
      {isMobile && !collapsed && (
        <div className={theme.backdrop} onClick={() => setCollapsed(true)} />
      )}
      <Navbar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
      />
      <main className={theme.mainContent} style={{ marginLeft: sidebarWidth }}>
        <div className="w-full max-w-[1200px]">
          <TopBar />
          {children}
        </div>
      </main>
    </div>
  );
}
