import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "../styles/navbar.css";

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

  return (
    <div className="app-layout">
      {isMobile && !collapsed && (
        <div className="sidebar-backdrop" onClick={() => setCollapsed(true)} />
      )}
      <Navbar collapsed={collapsed} setCollapsed={setCollapsed} isMobile={isMobile} />
      <main className={`main-content ${collapsed ? "collapsed" : ""} ${isMobile ? "mobile" : ""}`}>
        {children}
      </main>
    </div>
  );
}