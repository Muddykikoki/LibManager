import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { login as ls } from "../styles/loginStyles";
import "../styles/login.css";

const ERASE_MS = 55;
const CHAR_W = 12.5;
const PEN_TIP_X = 11;
const PEN_TIP_Y = 64;
const FONT_SZ = 22;
const PAD_T = 8;
const PAD_L = 14;
const BASELINE_RATIO = 0.78;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function Quill() {
  return (
    <svg viewBox="0 0 36 108" width="22" height="66">
      <defs>
        <linearGradient id="qf" x1=".2" y1="0" x2=".8" y2="1">
          <stop offset="0%" stopColor="#faf5e8" />
          <stop offset="100%" stopColor="#d4c5a0" />
        </linearGradient>
        <linearGradient id="qs" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a08960" />
          <stop offset="50%" stopColor="#c9b080" />
          <stop offset="100%" stopColor="#8b7355" />
        </linearGradient>
      </defs>
      <path d="M18 6Q8 13 3 9Q10 19 18 15" fill="url(#qf)" opacity=".92" />
      <path d="M18 15Q6 24 2 20Q10 30 18 26" fill="url(#qf)" opacity=".84" />
      <path d="M18 26Q5 36 1 32Q10 42 18 38" fill="url(#qf)" opacity=".76" />
      <path d="M18 38Q7 48 3 44Q12 53 18 49" fill="url(#qf)" opacity=".68" />
      <path d="M18 49Q9 57 6 55Q13 62 18 58" fill="url(#qf)" opacity=".60" />
      <path d="M18 6Q28 13 33 9Q26 19 18 15" fill="url(#qf)" opacity=".88" />
      <path d="M18 15Q30 24 34 20Q26 30 18 26" fill="url(#qf)" opacity=".80" />
      <path d="M18 26Q31 36 35 32Q26 42 18 38" fill="url(#qf)" opacity=".72" />
      <path d="M18 38Q29 48 33 44Q24 53 18 49" fill="url(#qf)" opacity=".64" />
      <path d="M18 49Q27 57 30 55Q23 62 18 58" fill="url(#qf)" opacity=".56" />
      <line x1="18" y1="4" x2="18" y2="78" stroke="url(#qs)" strokeWidth="2" />
      <line x1="17.5" y1="8" x2="17.5" y2="50" stroke="#d4c0a0" strokeWidth=".4" opacity=".5" />
      <path d="M18 74Q18 80 17.5 84" stroke="#5c4a2e" strokeWidth="2.5" fill="none" />
      <path d="M16 84L17 98 18 104 19 98 20 84" fill="#3c2a10" stroke="#2a1808" strokeWidth=".4" />
      <line x1="18" y1="87" x2="18" y2="101" stroke="#1a0800" strokeWidth=".5" />
      <path d="M16.5 86L17.5 96L18 86" fill="#5c4a30" opacity=".3" />
      <circle cx="18" cy="104" r="1.5" fill="#0a0a2e" opacity=".7">
        <animate attributeName="r" values="1;2.2;1" dur="1.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function Watch() {
  return (
    <svg viewBox="0 -28 60 116" width="52" height="84">
      <defs>
        <radialGradient id="wf" cx=".4" cy=".35" r=".6">
          <stop offset="0%" stopColor="#faf5e4" />
          <stop offset="100%" stopColor="#e8dcc4" />
        </radialGradient>
      </defs>
      <g className="chain-sway" style={{ transformOrigin: "30px -8px" }}>
        <path d="M30-25Q33-20 30-16Q27-12 30-8Q33-4 30 0" stroke="#c9a96e" strokeWidth="1.5" fill="none" opacity=".6" />
        <ellipse cx="30" cy="-25" rx="3" ry="2.5" fill="none" stroke="#c9a96e" strokeWidth="1" opacity=".5" />
      </g>
      <path d="M30 0L30 5" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="30" cy="9" rx="4" ry="5" fill="none" stroke="#c9a96e" strokeWidth="1.5" />
      <path d="M30 14L30 20" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" />
      <rect x="27.5" y="20" width="5" height="6" rx="1.5" fill="#c9a96e" stroke="#a08040" strokeWidth=".5" />
      <circle cx="30" cy="52" r="25" fill="#2a1c0a" stroke="#c9a96e" strokeWidth="2.5" />
      <circle cx="30" cy="52" r="22" fill="none" stroke="#a08040" strokeWidth=".4" opacity=".6" />
      <circle cx="30" cy="52" r="20" fill="url(#wf)" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = ((i * 30 - 90) * Math.PI) / 180;
        const r1 = i % 3 === 0 ? 16 : 17;
        return (
          <line key={i}
            x1={30 + r1 * Math.cos(a)} y1={52 + r1 * Math.sin(a)}
            x2={30 + 19 * Math.cos(a)} y2={52 + 19 * Math.sin(a)}
            stroke="#3c2a10" strokeWidth={i % 3 === 0 ? 1.5 : .6}
          />
        );
      })}
      {["XII", "III", "VI", "IX"].map((n, i) => {
        const a = ((i * 90 - 90) * Math.PI) / 180;
        return (
          <text key={n}
            x={30 + 13 * Math.cos(a)} y={52 + 13 * Math.sin(a)}
            textAnchor="middle" dominantBaseline="central"
            fill="#3c2a10" fontSize="4.5"
            fontFamily="Cormorant Garamond,serif" fontWeight="600"
          >{n}</text>
        );
      })}
      <g className="wh"><line x1="30" y1="52" x2="30" y2="41" stroke="#1a1008" strokeWidth="2.2" strokeLinecap="round" /></g>
      <g className="wm"><line x1="30" y1="52" x2="39" y2="47" stroke="#1a1008" strokeWidth="1.2" strokeLinecap="round" /></g>
      <g className="ws"><line x1="30" y1="52" x2="30" y2="36" stroke="#b33" strokeWidth=".5" strokeLinecap="round" /></g>
      <circle cx="30" cy="52" r="2" fill="#c9a96e" stroke="#8b6914" strokeWidth=".5" />
      <ellipse cx="24" cy="46" rx="7" ry="9" fill="#fff" opacity=".08" transform="rotate(-25 24 46)" />
    </svg>
  );
}

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const [field, setField] = useState(null);
  const [qPos, setQPos] = useState({ x: 0, y: 0 });
  const [dipping, setDipping] = useState(false);
  const [dots, setDots] = useState([]);
  const [shaking, setShaking] = useState(false);
  const [dimmed, setDimmed] = useState(false);
  const [tearActive, setTearActive] = useState(false);
  const [showWatch, setShowWatch] = useState(false);
  const [watchExiting, setWatchExiting] = useState(false);
  const [watchReversed, setWatchReversed] = useState(false);
  const [warning, setWarning] = useState(false);
  const [erasing, setErasing] = useState(false);
  const [exitPhase, setExitPhase] = useState(0);
  const [glowing, setGlowing] = useState(false);

  const mounted = useRef(true);
  const bookEl = useRef(null);
  const emailEl = useRef(null);
  const senhaEl = useRef(null);
  const dotId = useRef(0);
  const eraseTmr = useRef(null);
  const eRef = useRef("");
  const sRef = useRef("");

  useEffect(() => () => { mounted.current = false; }, []);
  useEffect(() => { eRef.current = email; }, [email]);
  useEffect(() => { sRef.current = senha; }, [senha]);
  useEffect(() => () => { if (eraseTmr.current) clearInterval(eraseTmr.current); }, []);

  const getBaseline = useCallback((inputEl) => {
    if (!bookEl.current || !inputEl) return null;
    const cR = bookEl.current.getBoundingClientRect();
    const iR = inputEl.getBoundingClientRect();
    return {
      x: iR.left - cR.left + PAD_L,
      y: iR.top - cR.top + PAD_T + FONT_SZ * BASELINE_RATIO,
    };
  }, []);

  const focusEmail = () => {
    const pos = getBaseline(emailEl.current);
    if (pos) setQPos(pos);
    setField("email");
  };

  const focusSenha = () => {
    const pos = getBaseline(senhaEl.current);
    if (pos) setQPos(pos);
    setField("senha");
  };

  const moveQuill = useCallback(() => {
    if (!bookEl.current || !field) return;
    const cR = bookEl.current.getBoundingClientRect();
    const el = field === "email" ? emailEl.current : senhaEl.current;
    if (!el) return;
    const iR = el.getBoundingClientRect();
    const len = field === "email" ? email.length : senha.length;
    if (!mounted.current) return;
    setQPos({
      x: iR.left - cR.left + PAD_L + Math.min(len * CHAR_W, iR.width - PAD_L * 2) + 2,
      y: iR.top - cR.top + PAD_T + FONT_SZ * BASELINE_RATIO,
    });
  }, [field, email, senha]);

  useEffect(() => { moveQuill(); }, [moveQuill]);

  const addDot = useCallback(() => {
    const id = ++dotId.current;
    setDots((p) => [
      ...p.slice(-6),
      { id, x: qPos.x + (Math.random() - 0.5) * 6, y: qPos.y + Math.random() * 4 },
    ]);
    setTimeout(() => setDots((p) => p.filter((d) => d.id !== id)), 800);
  }, [qPos]);

  const onEmail = (e) => {
    setEmail(e.target.value);
    if (!erasing && !exitPhase) { setDipping(true); addDot(); setTimeout(() => setDipping(false), 150); }
  };

  const onSenha = (e) => {
    setSenha(e.target.value);
    if (!erasing && !exitPhase) { setDipping(true); addDot(); setTimeout(() => setDipping(false), 150); }
  };

  const eraseField = (setter, text) =>
    new Promise((res) => {
      if (!text) { res(); return; }
      let t = text;
      eraseTmr.current = setInterval(() => {
        t = t.slice(0, -1);
        if (!t.length) { clearInterval(eraseTmr.current); setter(""); res(); }
        else setter(t);
      }, ERASE_MS);
    });

  const playError = async () => {
    setShaking(true);
    await wait(700);
    if (!mounted.current) return;
    setShaking(false);

    setDimmed(true);
    setTearActive(true);
    await wait(500);
    if (!mounted.current) return;

    setShowWatch(true);
    setWatchReversed(false);
    setWarning(true);
    await wait(1500);
    if (!mounted.current) return;

    setWatchReversed(true);
    setWarning(false);
    setErasing(true);

    setField("senha");
    await eraseField(setSenha, sRef.current);
    if (!mounted.current) return;

    setField("email");
    await eraseField(setEmail, eRef.current);
    if (!mounted.current) return;

    setWatchExiting(true);
    await wait(600);
    if (!mounted.current) return;
    setShowWatch(false);
    setWatchExiting(false);
    setWatchReversed(false);

    await wait(300);
    if (!mounted.current) return;
    setField(null);
    setErasing(false);
    setTearActive(false);
    setDimmed(false);
  };

  const removeExitOverlay = () => {
    const el = document.getElementById("__login_exit");
    if (el) el.remove();
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      setExitPhase(1);
      setGlowing(true);
      await wait(800);
      if (!mounted.current) return;

      setExitPhase(2);
      await wait(600);
      if (!mounted.current) return;

      const ov = document.createElement("div");
      ov.id = "__login_exit";
      ov.style.cssText =
        "position:fixed;inset:0;z-index:9999;background:#080504;opacity:0;transition:opacity .5s ease;";
      document.body.appendChild(ov);
      ov.offsetHeight;
      ov.style.opacity = "1";
      await wait(600);

      await login(email, senha);

      await wait(400);
      ov.style.opacity = "0";
      await wait(500);
      ov.remove();
    } catch (err) {
      removeExitOverlay();
      setExitPhase(0);
      setGlowing(false);
      setErro(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Erro ao fazer login",
      );
      await playError();
    } finally {
      if (mounted.current) setCarregando(false);
    }
  }

  const animDisabled = erasing || exitPhase > 0;
  const showPen = field && !exitPhase;

  return (
    <div className={`${ls.page} login-page`}>
      <div className={`${ls.glow} login-glow`} />

      <form
        ref={bookEl}
        onSubmit={handleSubmit}
        className={`${ls.book} ${!exitPhase ? (shaking ? "book-shake" : "book-float") : ""}`}
      >
        <div className={`${ls.pageL} book-page-left${exitPhase >= 1 ? " exit-text-fade" : ""}`}>
          <div className={ls.orn}><span className={ls.ornCh}>{"\u2756 \u2756 \u2756"}</span></div>
          <h1 className={ls.title}>LibManager</h1>
          <p className={ls.sub}>Acesse sua conta</p>
          <div className={`${ls.hr} divider-line`} />
          <div className={ls.fg}>
            <label className={ls.label}>E-mail</label>
            <input
              ref={emailEl}
              type="email"
              placeholder="Ex: bibliotecario@biblioteca.com"
              value={email}
              onChange={onEmail}
              onFocus={focusEmail}
              required
              disabled={animDisabled}
              className={`${ls.input} field-input${warning ? " input-warning text-tremble" : ""}`}
            />
          </div>
          <span className={ls.pn}>i</span>
          {exitPhase >= 1 && <div className="exit-golden-page exit-golden-left" />}
          {dimmed && <div className={`${ls.dim} dim-overlay`} style={{ background: "rgba(0,0,0,.12)" }} />}
          {tearActive && <div className={ls.tear}><div className={`${ls.tearLine} tear-line tear-grow`} /></div>}
        </div>

        <div className={`${ls.spine} book-spine-grad${exitPhase >= 2 ? " spine-glow-intense" : ""}`}>
          {[...Array(6)].map((_, i) => <div key={i} className={`${ls.spineDec} book-spine-deco`} />)}
        </div>

        <div className={`${ls.pageR} book-page-right${exitPhase >= 1 ? " exit-text-fade" : ""}${exitPhase >= 2 ? " page-close-right" : ""}`}>
          <div className={ls.orn}><span className={ls.ornCh}>{"\u2756 \u2756 \u2756"}</span></div>
          <div className="flex-1 flex flex-col">
            <div className={ls.fg}>
              <label className={ls.label}>Senha</label>
              <input
                ref={senhaEl}
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={onSenha}
                onFocus={focusSenha}
                required
                disabled={animDisabled}
                className={`${ls.input} field-input${warning ? " input-warning text-tremble" : ""}`}
              />
            </div>
            <button type="submit" disabled={carregando || animDisabled} className={`${ls.btn} submit-btn`}>
              {carregando ? "Entrando..." : "Entrar"}
            </button>
            {erro && <p className={ls.err}>{erro}</p>}
          </div>
          <span className={ls.pn}>ii</span>
          {exitPhase >= 1 && <div className="exit-golden-page exit-golden-right" />}
          {dimmed && <div className={`${ls.dim} dim-overlay`} style={{ background: "rgba(0,0,0,.12)" }} />}
          {tearActive && <div className={ls.tear}><div className={`${ls.tearLine} tear-line tear-grow`} /></div>}
        </div>

        {glowing && <div className={`${ls.glow2} closing-glow-bg glow-pulse`} />}

        {showPen && (
          <div
            className={ls.quill}
            style={{
              left: qPos.x - PEN_TIP_X,
              top: qPos.y - PEN_TIP_Y,
              zIndex: 50,
              transform: "translateZ(1px)",
              transition: "left .12s ease-out, top .12s ease-out",
            }}
          >
            <div
              className={`quill-shadow ${erasing ? "quill-erase-anim" : dipping ? "quill-dip-anim" : "quill-float-anim"}`}
              style={{ transformOrigin: `${PEN_TIP_X}px ${PEN_TIP_Y}px` }}
            >
              <Quill />
            </div>
          </div>
        )}

        {dots.map((d) => (
          <div key={d.id} className={`${ls.dot} ink-dot-bg ink-splat`} style={{ left: d.x - 2.5, top: d.y - 2.5 }} />
        ))}
      </form>

      {showWatch && (
        <div className={`${ls.watch} ${watchExiting ? "watch-exit" : "watch-enter"}`} style={{ right: "max(14px, calc(50vw - 330px))", top: "38%" }}>
          <div className={`watch-pendulum${watchReversed ? " watch-hands-reverse" : ""}`}>
            <Watch />
          </div>
          <p className={ls.watchTxt}>{watchReversed ? "voltando..." : "tick... tack..."}</p>
        </div>
      )}
    </div>
  );
}