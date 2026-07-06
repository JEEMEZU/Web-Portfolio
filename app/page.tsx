'use client';

import dynamic from 'next/dynamic';
import { Bebas_Neue, Orbitron } from 'next/font/google';
import React, { Component, type ErrorInfo, type PropsWithChildren, type ReactNode, useEffect, useState, useRef, useCallback } from 'react';
import LoadingScreen from './LoadingScreen';

const orbitron = Orbitron({
  weight: 'variable',
  subsets: ['latin'],
  variable: '--font-page-orbitron',
});

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-page-display',
});

const Spline = dynamic(() => import('@splinetool/react-spline').then((mod) => mod.default), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100vh', background: '#0b0a1a' }} />,
});

class SplineErrorBoundary extends Component<PropsWithChildren<{ fallback: ReactNode }>, { hasError: boolean }> {
  constructor(props: PropsWithChildren<{ fallback: ReactNode }>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Spline failed to render:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function SplineFallback() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '360px', background: 'radial-gradient(circle at top, rgba(124,58,237,0.22), transparent 55%), linear-gradient(135deg, #0b0a1a 0%, #131126 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(139,92,246,0.16)' }}>
      <div style={{ textAlign: 'center', color: '#c4b5fd' }}>
        <div style={{ fontFamily: 'var(--font-page-display), sans-serif', fontSize: '14px', letterSpacing: '0.2em', marginBottom: '8px' }}>3D Visual</div>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: '11px', color: '#6d5e9c' }}>Interactive scene unavailable right now</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── CUSTOM CURSOR ─────────────────────────── */
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const animRef = useRef(0);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', move);

    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${posRef.current.x - 4}px, ${posRef.current.y - 4}px)`;
      }
      if (ringRef.current) {
        ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * 0.13;
        ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * 0.13;
        ringRef.current.style.transform = `translate(${ringPosRef.current.x - 18}px, ${ringPosRef.current.y - 18}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);

    const addHover = () => { ringRef.current?.classList.add('cursor-ring--hover'); dotRef.current?.classList.add('cursor-dot--hover'); };
    const removeHover = () => { ringRef.current?.classList.remove('cursor-ring--hover'); dotRef.current?.classList.remove('cursor-dot--hover'); };
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });

    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

/* ─────────────────────────────── TYPEWRITER (multi) ─────────────────────── */
const TYPED_PHRASES = [
  'Front To Back',
  'Clean Code',
  'Full-Stack Apps',
  'Real Products',
  'End To End',
  'APIs & UIs',
];

function useTypewriter({ speed = 80, deleteSpeed = 40, pause = 1800 } = {}) {
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState<'typing' | 'deleting'>('typing');
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    const text = TYPED_PHRASES[phraseIdx];
    let timeout: NodeJS.Timeout;
    if (phase === 'typing') {
      if (displayed.length < text.length) {
        timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), speed);
      } else {
        timeout = setTimeout(() => setPhase('deleting'), pause);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), deleteSpeed);
      } else {
        timeout = setTimeout(() => {
          setPhraseIdx(i => (i + 1) % TYPED_PHRASES.length);
          setPhase('typing');
        }, deleteSpeed);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, phase, phraseIdx, speed, deleteSpeed, pause]);

  return displayed;
}

/* ─────────────────────────────── AI GLITCH PILLS ─────────────────────────── */
const AI_TOOLS = [
  {
    name: 'ChatGPT', color: '#10a37f', border: 'rgba(16,163,127,0.45)', glow: 'rgba(16,163,127,0.18)',
    icon: (<svg width="15" height="15" viewBox="0 0 41 41" fill="none"><path d="M37.532 16.87a9.963 9.963 0 00-.856-8.184 10.078 10.078 0 00-10.855-4.835 9.964 9.964 0 00-7.505-3.348 10.079 10.079 0 00-9.61 6.977 9.967 9.967 0 00-6.664 4.834 10.08 10.08 0 001.24 11.817 9.965 9.965 0 00.856 8.185 10.079 10.079 0 0010.855 4.835 9.965 9.965 0 007.504 3.347 10.078 10.078 0 009.617-6.981 9.967 9.967 0 006.663-4.834 10.079 10.079 0 00-1.243-11.813zM22.498 37.886a7.474 7.474 0 01-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 00.655-1.134V19.054l3.366 1.944a.12.12 0 01.066.092v9.299a7.505 7.505 0 01-7.49 7.496zM6.392 31.006a7.471 7.471 0 01-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 001.308 0l9.724-5.614v3.888a.12.12 0 01-.048.103l-8.051 4.649a7.504 7.504 0 01-10.24-2.744zM4.297 13.62A7.469 7.469 0 018.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 00.654 1.132l9.723 5.614-3.366 1.944a.12.12 0 01-.114.012L7.044 23.86a7.504 7.504 0 01-2.747-10.24zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 01.114-.012l8.048 4.648a7.498 7.498 0 01-1.158 13.528v-9.476a1.293 1.293 0 00-.647-1.13zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 00-1.308 0l-9.723 5.614v-3.888a.12.12 0 01.048-.103l8.05-4.645a7.497 7.497 0 0111.135 7.763zm-21.063 6.929l-3.367-1.944a.12.12 0 01-.065-.092v-9.299a7.497 7.497 0 0112.293-5.756 6.94 6.94 0 00-.236.134l-7.965 4.6a1.294 1.294 0 00-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.5v4.999l-4.331 2.5-4.331-2.5V18z" fill="currentColor"/></svg>),
  },
  {
    name: 'Claude', color: '#d97757', border: 'rgba(217,119,87,0.45)', glow: 'rgba(217,119,87,0.18)',
    icon: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-1.385-.121-.266-.072-.17-.097-.072-.17.024-.195.097-.146.17-.097.388-.072 1.59-.049 2.146-.072 2.001-.122.996-.17.17-.097.048-.146-.097-.121-1.012-.146-2.025-.267-1.976-.388-1.206-.315-.775-.267-.485-.267-.388-.315-.121-.364.072-.34.267-.221.34-.049.267.024.897.267 1.542.413 1.785.389 1.203.218.823.049.17-.073.024-.17-.34-.437-.897-1.036-1.012-1.23-.945-1.157-.485-.606-.267-.485-.049-.388.17-.291.315-.17.388-.024.315.097.17.146.8.848.945 1.084 1.036 1.181.897 1.012.485.534.146.17h.17l.073-.146-.049-.267-.315-1.06-.534-1.784-.364-1.59-.146-.824v-.606l.073-.364.17-.291.291-.17.388-.024.34.146.194.267.097.413.097.85.291 1.59.485 1.807.534 1.687.364.897.194.267.146.073.146-.049.073-.194V4.048l.049-1.735.073-1.012.097-.606.194-.388.267-.267.364-.097.364.073.291.17.194.315.049.388-.049.606-.073.85-.097 1.445-.049 1.59v1.59l.049.267.097.146.194.049.146-.122 1.036-1.445.945-1.254.8-1.012.606-.679.388-.315.364-.097.388.073.267.194.146.315-.024.364-.17.315-.437.534-.8.994-1.157 1.542-.8 1.133-.388.679-.073.17.049.121.146.049.34-.073.897-.267 1.3-.364 1.157-.267.8-.097.679-.024.34.097.17.267.073.315-.073.267-.194.17-.364.097-.606-.024-1.084-.194-1.59-.267-1.036-.17-.752-.049h-.194l-.097.097.024.17.34.461.8.994 1.084 1.29.994 1.206.485.703.073.388-.049.291-.194.194-.34.097-.364-.073-.146-.073-.775-.848-1.012-1.23-.994-1.23-.485-.606-.194-.17-.146.049-.049.17.049.267.146.606.388 1.493.34 1.784.17 1.157.024.485-.097.388-.267.267-.267.073-.267-.073-.194-.17-.146-.364-.097-.606-.194-1.59-.388-1.881-.291-1.108-.048-.17h-.098l-.072.049-2.429 7.768-.388.824-.291.388-.315.17-.364.049-.485-.146-.364-.267-.146-.364.049-.267.17-.388.437-.776 3.392-7.04.146-.388.024-.194-.049-.073-.17.024-.267.243-4.623 2.89-.8.364-.703.097-.582-.097-.461-.267-.267-.388-.049-.461.097-.34.267-.267.364-.146z" fill="currentColor"/></svg>),
  },
  {
    name: 'Cursor', color: '#7c6af7', border: 'rgba(124,106,247,0.45)', glow: 'rgba(124,106,247,0.18)',
    icon: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M13.5 3L21 12L13.5 21H10.5L17.25 12L10.5 3H13.5Z" fill="currentColor"/><path d="M7.5 3L15 12L7.5 21H4.5L11.25 12L4.5 3H7.5Z" fill="currentColor" opacity="0.5"/></svg>),
  },
  {
    name: 'Deepseek', color: '#4c8bf5', border: 'rgba(76,139,245,0.45)', glow: 'rgba(76,139,245,0.18)',
    icon: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>),
  },
  {
    name: 'Gemini', color: '#4285f4', border: 'rgba(66,133,244,0.45)', glow: 'rgba(66,133,244,0.18)',
    icon: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 22C12 22 4 16.5 4 10a8 8 0 1116 0c0 6.5-8 12-8 12z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/></svg>),
  },
  {
    name: 'Copilot', color: '#24bfa5', border: 'rgba(36,191,165,0.45)', glow: 'rgba(36,191,165,0.18)',
    icon: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9z" stroke="currentColor" strokeWidth="2"/><path d="M9 9l6 3-6 3V9z" fill="currentColor"/></svg>),
  },
  {
    name: 'Windsurf', color: '#9d6ef7', border: 'rgba(157,110,247,0.45)', glow: 'rgba(157,110,247,0.18)',
    icon: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M3 17l4-8 4 8M9 15h4m4-8v8m0-8l3 4-3 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  },
  {
    name: 'Codex', color: '#20b2c8', border: 'rgba(32,178,200,0.45)', glow: 'rgba(32,178,200,0.18)',
    icon: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>),
  },
];

interface GlitchTool { id: number; tool: typeof AI_TOOLS[0]; x: number; y: number; phase: 'in' | 'visible' | 'out'; }

const SPAWN_POSITIONS = [
  { top: 10, left: 4 }, { top: 16, left: 68 },
  { top: 28, left: 12 }, { top: 36, left: 74 },
  { top: 48, left: 6  }, { top: 54, left: 62 },
  { top: 64, left: 18 }, { top: 70, left: 76 },
  { top: 80, left: 8  }, { top: 78, left: 55 },
  { top: 22, left: 42 }, { top: 58, left: 46 },
];

function AIGlitchOverlay() {
  const [tools, setTools] = useState<GlitchTool[]>([]);
  const counterRef = useRef(0);
  const usedToolsRef = useRef<Set<number>>(new Set());
  const usedPosRef = useRef<Set<number>>(new Set());

  const spawn = useCallback(() => {
    const availTools = AI_TOOLS.map((_, i) => i).filter(i => !usedToolsRef.current.has(i));
    const availPos = SPAWN_POSITIONS.map((_, i) => i).filter(i => !usedPosRef.current.has(i));
    if (availTools.length === 0 || availPos.length === 0) return;
    const toolIdx = availTools[Math.floor(Math.random() * availTools.length)];
    const posIdx = availPos[Math.floor(Math.random() * availPos.length)];
    usedToolsRef.current.add(toolIdx);
    usedPosRef.current.add(posIdx);
    const id = counterRef.current++;
    const pos = SPAWN_POSITIONS[posIdx];
    setTools(prev => [...prev, { id, tool: AI_TOOLS[toolIdx], x: pos.left, y: pos.top, phase: 'in' }]);
    setTimeout(() => setTools(prev => prev.map(t => t.id === id ? { ...t, phase: 'visible' } : t)), 60);
    const life = 3000 + Math.random() * 2000;
    setTimeout(() => setTools(prev => prev.map(t => t.id === id ? { ...t, phase: 'out' } : t)), life);
    setTimeout(() => {
      setTools(prev => prev.filter(t => t.id !== id));
      usedToolsRef.current.delete(toolIdx);
      usedPosRef.current.delete(posIdx);
    }, life + 600);
  }, []);

  useEffect(() => {
    const timers = [
      setTimeout(() => spawn(), 400),
      setTimeout(() => spawn(), 950),
      setTimeout(() => spawn(), 1600),
    ];
    const interval = setInterval(() => {
      setTools(prev => {
        const active = prev.filter(t => t.phase !== 'out').length;
        if (active < 4) spawn();
        return prev;
      });
    }, 1200);
    return () => { timers.forEach(clearTimeout); clearInterval(interval); };
  }, [spawn]);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5, overflow: 'hidden' }}>
      {tools.map(t => (
        <div
          key={t.id}
          className={`ai-cyber-pill ai-cyber-pill--${t.phase}`}
          style={{
            position: 'absolute', left: `${t.x}%`, top: `${t.y}%`,
            '--pill-color': t.tool.color, '--pill-border': t.tool.border, '--pill-glow': t.tool.glow,
          } as React.CSSProperties}
        >
          <div className="ai-cyber-pill__scanlines" />
          <div className="ai-cyber-pill__border-spin" style={{ background: `conic-gradient(from 0deg, transparent 0deg, ${t.tool.color} 90deg, transparent 180deg, transparent 360deg)` }} />
          <span className="ai-cyber-pill__icon" style={{ color: t.tool.color }}>{t.tool.icon}</span>
          <span className="ai-cyber-pill__name" style={{ color: t.tool.color }}>{t.tool.name}</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────── DOT PARTICLES ─────────────────────────── */
interface Dot { id: number; x: number; y: number; size: number; opacity: number; color: string; vx: number; vy: number; }
const DOT_COLORS = ['rgba(167,139,250,VAL)', 'rgba(124,58,237,VAL)', 'rgba(139,92,246,VAL)', 'rgba(196,181,253,VAL)', 'rgba(109,40,217,VAL)'];

function DotParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const animRef = useRef<number>(0);
  const counterRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize(); window.addEventListener('resize', resize);
    const spawnDot = (): Dot => {
      const angle = Math.random() * Math.PI * 2; const speed = 0.18 + Math.random() * 0.22;
      return { id: counterRef.current++, x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: 1.5 + Math.random() * 2, opacity: 0, color: DOT_COLORS[Math.floor(Math.random() * DOT_COLORS.length)], vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed };
    };
    for (let i = 0; i < 8; i++) { const d = spawnDot(); d.opacity = Math.random() * 0.5; dotsRef.current.push(d); }
    let st = 0;
    const animate = () => {
      if (!canvas || !ctx) return; ctx.clearRect(0, 0, canvas.width, canvas.height); st++;
      if (st % 90 === 0 && dotsRef.current.length < 12) dotsRef.current.push(spawnDot());
      dotsRef.current = dotsRef.current.filter(d => {
        if (d.opacity < 0.55) d.opacity += 0.004; d.x += d.vx; d.y += d.vy;
        if (d.x < -20 || d.x > canvas.width + 20 || d.y < -20 || d.y > canvas.height + 20) return false;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2); ctx.fillStyle = d.color.replace('VAL', String(d.opacity)); ctx.fill(); return true;
      });
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 3 }} />;
}

/* ─────────────────────────────── GLITCH PHOTO CARD ─────────────────────── */
function GlitchPhotoCard() {
  return (
    <div className="cyber-card-wrapper">
      <div className="cyber-card-container">
        <div className="cyber-card-content">
          <div className="cyber-rotate-border" />
          <div className="cyber-after-overlay" />
          <div className="cyber-card-title"><span className="cyber-title-text">JAMES A. AGBO</span></div>
          <div className="cyber-photo-wrap">
            <img src="/profile.jpg" alt="James Agbo" className="cyber-photo" />
            <div className="cyber-glitch-layer cyber-glitch-r" />
            <div className="cyber-glitch-layer cyber-glitch-b" />
            <div className="cyber-photo-scanlines" />
            <div className="cyber-photo-fade" />
          </div>
          <div className="cyber-card-footer"><span className="cyber-title-text cyber-title-text--orbitron">IT STUDENT · PH</span></div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── LIVE TERMINAL ─────────────────────────── */
const TERMINAL_LINES = [
  { type: 'git',    text: 'git commit -m "feat: catering order flow"' },
  { type: 'ok',     text: '✓ build passed  [712ms]' },
  { type: 'deploy', text: '⬡ deploying to vercel...' },
  { type: 'git',    text: 'git push origin main' },
  { type: 'ok',     text: '✓ lighthouse  perf 97 / a11y 100' },
  { type: 'cmd',    text: 'npm run test -- --coverage' },
  { type: 'ok',     text: '✓ 38 tests passed  0 failed' },
  { type: 'deploy', text: '⬡ live → james-agbo.vercel.app' },
  { type: 'git',    text: 'git commit -m "fix: supabase realtime sync"' },
  { type: 'cmd',    text: 'python manage.py migrate' },
  { type: 'ok',     text: '✓ migrations applied' },
  { type: 'git',    text: 'git commit -m "feat: AI cover letter gen"' },
  { type: 'cmd',    text: 'docker build -t jobzing:latest .' },
  { type: 'ok',     text: '✓ image built  [1.4s]' },
  { type: 'deploy', text: '⬡ health check  200 OK' },
  { type: 'git',    text: 'git commit -m "feat: telegram job notifs"' },
  { type: 'cmd',    text: 'eslint . --fix' },
  { type: 'ok',     text: '✓ 0 errors  0 warnings' },
  { type: 'deploy', text: '⬡ cdn cache purged' },
  { type: 'git',    text: 'git commit -m "refactor: vue composables"' },
];
const TYPE_COLOR: Record<string, string> = { git:'#a78bfa', ok:'#34d399', deploy:'#22d3ee', cmd:'#e2e8f0' };
interface TermLine { id: number; type: string; text: string; visible: boolean; }

function LiveTerminal() {
  const [lines, setLines] = useState<TermLine[]>([]);
  const counterRef = useRef(0);
  const indexRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const addLine = () => {
      const src = TERMINAL_LINES[indexRef.current % TERMINAL_LINES.length];
      indexRef.current++;
      const id = counterRef.current++;
      setLines(prev => { const next = [...prev, { id, type: src.type, text: src.text, visible: false }]; return next.slice(-12); });
      setTimeout(() => { setLines(prev => prev.map(l => l.id === id ? { ...l, visible: true } : l)); }, 40);
      setTimeout(() => { if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight; }, 80);
    };
    for (let i = 0; i < 5; i++) setTimeout(addLine, i * 120);
    const interval = setInterval(addLine, 1800 + Math.random() * 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="reveal" style={{ paddingTop: '4px' }}>
      <div style={{ background: 'rgba(5, 4, 18, 0.9)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 0 30px rgba(109,40,217,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderBottom: '1px solid rgba(139,92,246,0.12)', background: 'rgba(15,12,35,0.8)' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#28c840' }} />
          <span style={{ marginLeft: '6px', fontSize: '9px', fontFamily: "'Barlow', sans-serif", fontWeight: 600, color: '#3d3066', letterSpacing: '0.03em', textTransform: 'uppercase' }}>activity</span>
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="term-pulse" />
            <span style={{ fontSize: '8px', fontFamily: "'Barlow', sans-serif", color: '#34d399', letterSpacing: '0.04em' }}>LIVE</span>
          </span>
        </div>
        <div ref={containerRef} style={{ padding: '10px 12px', height: '320px', overflowY: 'hidden', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {lines.map((line, i) => (
            <div key={line.id} style={{ opacity: line.visible ? (i === lines.length - 1 ? 1 : Math.max(0.25, 1 - (lines.length - 1 - i) * 0.07)) : 0, transform: line.visible ? 'translateY(0)' : 'translateY(4px)', transition: 'opacity 0.25s ease, transform 0.25s ease', display: 'flex', alignItems: 'flex-start', gap: '6px', flexShrink: 0 }}>
              <span style={{ fontSize: '9px', fontFamily: "'Barlow', sans-serif", fontWeight: 600, color: '#2a2050', letterSpacing: '0.02em', paddingTop: '1px', flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontSize: '9.5px', fontFamily: "'Barlow', monospace", color: TYPE_COLOR[line.type] ?? '#e2e8f0', lineHeight: 1.5, wordBreak: 'break-all', opacity: 0.82 }}>{line.text}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <span style={{ fontSize: '9px', fontFamily: "'Barlow', sans-serif", color: '#2a2050' }}>{'>'}</span>
            <span className="term-cursor" />
          </div>
        </div>
        <div style={{ padding: '6px 12px', borderTop: '1px solid rgba(139,92,246,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '8px', fontFamily: "'Barlow', sans-serif", color: '#2a2050', letterSpacing: '0.04em' }}>james@portfolio ~/dev</span>
          <span style={{ fontSize: '8px', fontFamily: "'Barlow', sans-serif", color: '#3d3066', letterSpacing: '0.03em' }}>zsh</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
        {[{ label: 'Projects Shipped', val: '6', color: '#a78bfa', border: 'rgba(167,139,250,0.2)' }].map(s => (
          <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px', borderRadius: '6px', background: 'rgba(5,4,18,0.6)', border: `1px solid ${s.border}` }}>
            <span style={{ fontSize: '9px', fontFamily: "'Barlow', sans-serif", fontWeight: 600, color: '#3d3066', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.label}</span>
            <span style={{ fontSize: '9px', fontFamily: "var(--font-page-display), sans-serif", color: s.color, letterSpacing: '0.03em' }}>{s.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── CURRENTLY BUILDING ────────────────────────── */
function CurrentlyBuilding() {
  return (
    <div style={{ marginTop: '24px', padding: '14px 16px', borderRadius: '12px', background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)', backdropFilter: 'blur(8px)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #34d399, transparent)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399', flexShrink: 0, animation: 'termPulse 1.4s ease-in-out infinite' }} />
        <span style={{ fontSize: '9px', fontFamily: "'Barlow', sans-serif", fontWeight: 700, color: '#34d399', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Currently Building</span>
      </div>
      <div style={{ fontFamily: "var(--font-page-display), sans-serif", fontSize: '13px', color: '#f0eeff', letterSpacing: '0.03em', marginBottom: '4px' }}>Personal Portfolio v2</div>
      <p style={{ fontSize: '10px', fontFamily: "'Barlow', sans-serif", color: '#5a4e80', lineHeight: 1.7, margin: 0 }}>
        Next.js · Spline 3D · Framer Motion · Cyber aesthetic
      </p>
    </div>
  );
}

/* ─────────────────────────── SKILLS PROFICIENCY ────────────────────────── */
const SKILL_GROUPS = [
  {
    label: 'Frontend', color: '#a78bfa',
    skills: [
      { name: 'HTML / CSS', level: 95 },
      { name: 'JavaScript', level: 88 },
      { name: 'Vue.js', level: 85 },
      { name: 'React / Next.js', level: 80 },
      { name: 'Tailwind CSS', level: 90 },
    ],
  },
  {
    label: 'Backend', color: '#22d3ee',
    skills: [
      { name: 'PHP', level: 85 },
      { name: 'Python / Django', level: 80 },
      { name: 'Node.js', level: 70 },
      { name: 'REST APIs', level: 82 },
      { name: 'C# Desktop', level: 72 },
    ],
  },
  {
    label: 'Database & Cloud', color: '#34d399',
    skills: [
      { name: 'MySQL / PostgreSQL', level: 85 },
      { name: 'MongoDB', level: 75 },
      { name: 'Supabase', level: 80 },
      { name: 'AWS', level: 65 },
      { name: 'Git / GitHub', level: 88 },
    ],
  },
];

function SkillBar({ name, level, color, delay }: { name: string; level: number; color: string; delay: number }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => setAnimated(true), delay); obs.disconnect(); } }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div ref={ref} style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '10px', fontFamily: "'Barlow', sans-serif", fontWeight: 600, color: '#9d8fc4', letterSpacing: '0.03em' }}>{name}</span>
        <span style={{ fontSize: '9px', fontFamily: "var(--font-page-display), sans-serif", color: color, letterSpacing: '0.05em' }}>{level}%</span>
      </div>
      <div style={{ height: '4px', background: 'rgba(139,92,246,0.12)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: animated ? `${level}%` : '0%',
          background: `linear-gradient(90deg, ${color}99, ${color})`,
          borderRadius: '4px',
          transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: `0 0 8px ${color}66`,
        }} />
      </div>
    </div>
  );
}

function SkillsSection() {
  return (
    <section id="skills" style={{ background: '#0b0a1a', padding: '60px 6vw', borderTop: '1px solid rgba(139,92,246,0.08)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <p className="reveal" style={{ fontSize: '9px', fontFamily: "var(--font-page-display), sans-serif", color: '#7c3aed', letterSpacing: '0.22em', marginBottom: '6px' }}>02 — Skills</p>
        <h2 className="reveal" style={{ fontFamily: "var(--font-page-orbitron), sans-serif", fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 700, letterSpacing: '0.01em', color: '#f0eeff', marginBottom: '10px' }}>
          Tech{' '}<span style={{ background: 'linear-gradient(135deg, #a78bfa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Proficiency</span>
        </h2>
        <p className="reveal" style={{ fontSize: '11px', fontFamily: "'Barlow', sans-serif", color: '#5a4e80', maxWidth: '480px', lineHeight: 1.8, marginBottom: '40px' }}>
          Not just a list — here&apos;s an honest breakdown of where I actually stand with each stack.
        </p>
        <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {SKILL_GROUPS.map(group => (
            <div key={group.label} style={{ background: '#08071a', border: '1px solid rgba(139,92,246,0.12)', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${group.color}, transparent)` }} />
              <div style={{ fontSize: '9px', fontFamily: "'Barlow', sans-serif", fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: group.color, marginBottom: '18px' }}>{group.label}</div>
              {group.skills.map((s, i) => (
                <SkillBar key={s.name} name={s.name} level={s.level} color={group.color} delay={i * 80} />
              ))}
            </div>
          ))}
        </div>
        {/* AI Tools row */}
        <div className="reveal" style={{ marginTop: '24px', background: '#08071a', border: '1px solid rgba(139,92,246,0.1)', borderRadius: '16px', padding: '20px 24px' }}>
          <div style={{ fontSize: '9px', fontFamily: "'Barlow', sans-serif", fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#818cf8', marginBottom: '14px' }}>AI-Assisted Dev</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['ChatGPT', 'Claude', 'Cursor', 'Windsurf', 'Codex', 'GitHub Copilot', 'Gemini', 'DeepSeek'].map(t => (
              <span key={t} style={{ fontSize: '9px', fontFamily: "'Barlow', sans-serif", fontWeight: 700, padding: '4px 10px', borderRadius: '4px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#818cf8', border: '1px solid rgba(129,140,248,0.3)', background: 'rgba(129,140,248,0.08)' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── EXPERIENCE TIMELINE ───────────────────────── */
const TIMELINE = [
  {
    period: '2020 – 2022',
    title: 'Senior High School – ICT Strand',
    org: 'South East Asia Institute of Trade and Technology',
    desc: 'Specialized in Information & Communications Technology. Built foundational skills in programming, hardware, and software development.',
    type: 'education',
    color: '#818cf8',
    icon: '🎓',
  },
  {
    period: '2022 – 2026',
    title: 'BS Information Technology',
    org: 'Colegio de Montalban',
    desc: 'Pursuing a full degree in IT with focus on web development, software engineering, databases, and system design. Expected graduation: 2026.',
    type: 'education',
    color: '#a78bfa',
    icon: '🎓',
  },
  {
    period: 'Jan 2026 – Aug 2026',
    title: 'Intern – Web Developer',
    org: 'Elevate Solutions Experts · Montalban, Rizal',
    desc: 'Built and maintained web apps using Python, Vue.js, and AWS over a 7-month internship. Improved UI components, managed databases, fixed bugs, and collaborated on feature sprints with the dev team.',
    type: 'work',
    color: '#22d3ee',
    icon: '💼',
  },
];

function TimelineSection() {
  return (
    <section id="experience" style={{ background: '#0e0c1f', padding: '60px 6vw', borderTop: '1px solid rgba(139,92,246,0.08)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <p className="reveal" style={{ fontSize: '9px', fontFamily: "var(--font-page-display), sans-serif", color: '#7c3aed', letterSpacing: '0.22em', marginBottom: '6px' }}>03 — Experience</p>
        <h2 className="reveal" style={{ fontFamily: "var(--font-page-orbitron), sans-serif", fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 700, letterSpacing: '0.01em', color: '#f0eeff', marginBottom: '48px' }}>
          My{' '}<span style={{ background: 'linear-gradient(135deg, #a78bfa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Journey</span>
        </h2>
        <div style={{ position: 'relative', paddingLeft: '32px' }}>
          {/* vertical line */}
          <div style={{ position: 'absolute', left: '7px', top: '8px', bottom: '8px', width: '2px', background: 'linear-gradient(to bottom, #7c3aed, #22d3ee)', borderRadius: '2px', opacity: 0.3 }} />
          {TIMELINE.map((item, i) => (
            <div key={i} className="reveal" style={{ position: 'relative', marginBottom: '32px' }}>
              {/* dot */}
              <div style={{ position: 'absolute', left: '-29px', top: '6px', width: '14px', height: '14px', borderRadius: '50%', background: item.color, boxShadow: `0 0 12px ${item.color}88`, border: '2px solid #0b0a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px' }} />
              <div style={{ background: '#08071a', border: `1px solid ${item.color}22`, borderRadius: '14px', padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${item.color}, transparent)` }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-page-display), sans-serif", fontSize: '15px', letterSpacing: '0.03em', color: '#f0eeff', lineHeight: 1, marginBottom: '4px' }}>{item.title}</div>
                    <div style={{ fontSize: '10px', fontFamily: "'Barlow', sans-serif", fontWeight: 600, color: item.color, letterSpacing: '0.04em' }}>{item.org}</div>
                  </div>
                  <span style={{ fontSize: '9px', fontFamily: "var(--font-page-display), sans-serif", color: '#4c3d7a', letterSpacing: '0.08em', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '4px', padding: '3px 8px', whiteSpace: 'nowrap' }}>{item.period}</span>
                </div>
                <p style={{ fontSize: '11px', fontFamily: "'Barlow', sans-serif", color: '#5a4e80', lineHeight: 1.8, margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── PROJECTS ───────────────────────────────── */
const PROJECTS = [
  {
    num: '01', title: "Zaf's Kitchen Catering", role: 'Full-Stack Dev', img: '/zafs.jpg' as string | null,
    accentColor: '#a78bfa',
    tags: ['PHP', 'Supabase', 'Tailwind CSS', 'Electron.js', 'Brevo', 'API'],
    fullDesc: "Full catering system with three integrated platforms: a customer-facing ordering and reservations web app, an Electron.js admin dashboard for booking management and analytics, and a React Native staff mobile app for task and order tracking. Real-time notifications powered by Brevo across all surfaces.",
    liveUrl: '#', repoUrl: '#',
  },
  {
    num: '02', title: 'JobZing Job Aggregator', role: 'Full-Stack Dev', img: '/jobzing.png' as string | null,
    accentColor: '#22d3ee',
    tags: ['Vue.js', 'Python', 'Django', 'AWS', 'PostgreSQL', 'SQLite'],
    fullDesc: 'AI-powered job aggregation platform featuring intelligent job matching, AI-generated cover letters, one-click Auto Apply, advanced job filters, and real-time Telegram job notifications. Built with Vue.js on the frontend and a Python/Django backend deployed on AWS with dual database support.',
    liveUrl: '#', repoUrl: '#',
  },
  {
    num: '03', title: 'Code Chronicle', role: 'Full-Stack Dev', img: '/code_chronicle.png' as string | null,
    accentColor: '#34d399',
    tags: ['PHP', 'MongoDB', 'Figma', 'API Integration', 'Bootstrap'],
    fullDesc: 'Community platform for developers to share code snippets, articles, and discussions. Features API integrations, user profiles, content tagging, and a Figma-designed UI translated into a responsive PHP and MongoDB web application.',
    liveUrl: '#', repoUrl: '#',
  },
  {
    num: '04', title: 'Room Scheduling System', role: 'Desktop Dev', img: '/scheduling.jpg' as string | null,
    accentColor: '#818cf8',
    tags: ['C#', 'XAMPP', 'MySQL'],
    fullDesc: 'School room scheduling and reservation system built with C# for the desktop frontend and a MySQL/XAMPP backend. Allows administrators to manage room availability, assign schedules to classes, and prevent booking conflicts across departments.',
    liveUrl: '#', repoUrl: '#',
  },
  {
    num: '05', title: 'Kindergarten Enrollment', role: 'Web Dev', img: '/kindergarten.png' as string | null,
    accentColor: '#f472b6',
    tags: ['PHP', 'XAMPP', 'MySQL', 'Bootstrap'],
    fullDesc: 'Online enrollment system for a kindergarten school. Parents can register students, submit requirements, and track enrollment status. Admins manage applicants, review documents, and generate enrollment reports — all through a responsive Bootstrap interface.',
    liveUrl: '#', repoUrl: '#',
  },
  {
    num: '06', title: 'Personal Portfolio Website', role: 'Frontend Dev', img: '/portfolio.jpg' as string | null,
    accentColor: '#fbbf24',
    tags: ['Next.js', 'React', 'Spline', 'Vercel', 'TypeScript'],
    fullDesc: "This portfolio itself — built with Next.js, React, and a custom cyber aesthetic. Features a Spline 3D hero, animated AI tool pills, glitch photo card, sticky project showcase, live terminal, scroll-triggered reveals, and a full-stack hire form.",
    liveUrl: '#', repoUrl: '#',
  },
];

const PROJECT_FALLBACK_GRADIENTS = [
  'linear-gradient(135deg,#1a0533 0%,#3b0764 40%,#1e3a5f 100%)',
  'linear-gradient(135deg,#0a1628 0%,#0e2744 40%,#1a3a6b 100%)',
  'linear-gradient(135deg,#0d1f0d 0%,#0f3320 40%,#0a2233 100%)',
  'linear-gradient(135deg,#1a0a2e 0%,#2d1065 40%,#0a1628 100%)',
  'linear-gradient(135deg,#1a0a1e 0%,#2a0840 40%,#1a0a2e 100%)',
  'linear-gradient(135deg,#1a1200 0%,#3d2800 40%,#1a1a00 100%)',
];

function StickyProjectsShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeIdxRef = useRef(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const scrollToPage = useCallback((top: number) => {
    const options: ScrollToOptions = { top, behavior: 'smooth' };
    window.scrollTo(options); document.documentElement.scrollTo(options); document.body.scrollTo(options);
  }, []);

  useEffect(() => {
    let animationFrame = 0;
    const updateActiveProject = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const totalHeight = Math.max(1, sectionRef.current.offsetHeight - window.innerHeight);
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalHeight));
      const idx = Math.min(PROJECTS.length - 1, Math.floor(progress * PROJECTS.length));
      if (idx !== activeIdxRef.current) { activeIdxRef.current = idx; setActiveIdx(idx); }
    };
    const scrollTargets: EventTarget[] = [window, document, document.documentElement, document.body];
    scrollTargets.forEach(target => target.addEventListener('scroll', updateActiveProject, { passive: true }));
    const tick = () => { updateActiveProject(); animationFrame = requestAnimationFrame(tick); };
    tick();
    return () => { cancelAnimationFrame(animationFrame); scrollTargets.forEach(target => target.removeEventListener('scroll', updateActiveProject)); };
  }, []);

  return (
    <div ref={sectionRef} style={{ height: `${PROJECTS.length * 100}vh`, position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', overflow: 'hidden' }}>
        <div style={{ width: '38%', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 0 0 6vw', position: 'relative', zIndex: 2 }}>
          <p style={{ fontSize: '9px', fontFamily: "var(--font-page-display), sans-serif", color: '#7c3aed', letterSpacing: '0.22em', marginBottom: '12px' }}>04 — Selected Work</p>
          <h2 style={{ fontFamily: "var(--font-page-orbitron), sans-serif", fontSize: 'clamp(30px, 3.5vw, 46px)', fontWeight: 700, letterSpacing: '0.01em', color: '#f0eeff', lineHeight: 1, marginBottom: '32px' }}>
            Projects{' '}
            <span style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>I&apos;ve Built</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {PROJECTS.map((p, i) => (
              <button key={p.num} onClick={() => {
                if (!sectionRef.current) return;
                const sectionTop = sectionRef.current.offsetTop;
                const targetScroll = sectionTop + (i / PROJECTS.length) * (sectionRef.current.offsetHeight - window.innerHeight) + 10;
                scrollToPage(targetScroll);
              }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '14px 0', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid rgba(139,92,246,0.08)', textAlign: 'left', transition: 'all 0.3s ease' }}>
                <div style={{ width: activeIdx === i ? '28px' : '12px', height: '2px', background: activeIdx === i ? p.accentColor : 'rgba(139,92,246,0.2)', borderRadius: '2px', flexShrink: 0, transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)', boxShadow: activeIdx === i ? `0 0 8px ${p.accentColor}88` : 'none' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-page-display), sans-serif", fontSize: '13px', letterSpacing: '0.04em', color: activeIdx === i ? '#f0eeff' : '#3d3066', transition: 'color 0.3s ease', lineHeight: 1, marginBottom: '2px' }}>{p.title}</div>
                  <div style={{ fontSize: '9px', fontFamily: "'Barlow', sans-serif", fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: activeIdx === i ? p.accentColor : '#2a2050', transition: 'color 0.3s ease' }}>{p.role}</div>
                </div>
                <span style={{ fontFamily: "var(--font-page-display), sans-serif", fontSize: '9px', color: activeIdx === i ? p.accentColor : '#2a2050', letterSpacing: '0.03em', transition: 'color 0.3s ease', flexShrink: 0 }}>{p.num}</span>
              </button>
            ))}
          </div>
          <div style={{ marginTop: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ flex: 1, height: '2px', background: 'rgba(139,92,246,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${((activeIdx + 1) / PROJECTS.length) * 100}%`, background: `linear-gradient(90deg, #7c3aed, ${PROJECTS[activeIdx].accentColor})`, borderRadius: '2px', transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)', boxShadow: `0 0 8px ${PROJECTS[activeIdx].accentColor}66` }} />
            </div>
            <span style={{ fontFamily: "var(--font-page-display), sans-serif", fontSize: '9px', color: '#3d3066', letterSpacing: '0.03em', flexShrink: 0 }}>{activeIdx + 1} / {PROJECTS.length}</span>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 6vw 40px 4vw', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 50%, ${PROJECTS[activeIdx].accentColor}12 0%, transparent 65%)`, transition: 'background 0.6s ease', pointerEvents: 'none' }} />
          {PROJECTS.map((p, i) => (
            <StickyProjectCard key={p.num} project={p} isActive={activeIdx === i} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface StickyProjectCardProps { project: typeof PROJECTS[0]; isActive: boolean; index: number; }

function StickyProjectCard({ project: p, isActive, index }: StickyProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ position: 'absolute', width: 'min(480px, 85%)', maxHeight: '78vh', borderRadius: '16px', padding: '2px', background: isActive ? `conic-gradient(from 45deg, ${p.accentColor}00 0deg, ${p.accentColor}cc 80deg, ${p.accentColor}44 120deg, ${p.accentColor}00 180deg, transparent 360deg)` : 'transparent', boxShadow: isActive ? `0 0 40px ${p.accentColor}33, 0 0 80px ${p.accentColor}18, 0 40px 100px rgba(0,0,0,0.7)` : '0 8px 40px rgba(0,0,0,0.3)', opacity: isActive ? 1 : 0, transform: isActive ? 'translateY(0) scale(1)' : index % 2 === 0 ? 'translateY(40px) scale(0.93)' : 'translateY(-40px) scale(0.93)', transition: 'all 0.65s cubic-bezier(0.34, 1.2, 0.64, 1)', pointerEvents: isActive ? 'auto' : 'none', zIndex: isActive ? 2 : 1 } as React.CSSProperties}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ width: '100%', height: '100%', borderRadius: '14px', overflow: 'hidden', background: '#0a0918', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: '2px', background: `linear-gradient(90deg, transparent, ${p.accentColor}, transparent)`, boxShadow: `0 0 12px ${p.accentColor}`, flexShrink: 0 }} />
        <div style={{ position: 'relative', height: '220px', flexShrink: 0, background: PROJECT_FALLBACK_GRADIENTS[index], overflow: 'hidden' }}>
          {p.img && (<img src={p.img} alt={p.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transform: hovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.6s cubic-bezier(0.23,1,0.32,1)' }} />)}
          <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 2px,rgba(0,0,0,0.1) 2px,rgba(0,0,0,0.1) 4px)', zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, #0a0918 0%, transparent 100%)', zIndex: 3 }} />
          <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 5, background: `${p.accentColor}22`, border: `1px solid ${p.accentColor}55`, borderRadius: '4px', padding: '3px 10px', backdropFilter: 'blur(8px)' }}>
            <span style={{ fontFamily: "var(--font-page-display), sans-serif", fontSize: '10px', letterSpacing: '0.12em', color: p.accentColor }}>{p.role}</span>
          </div>
        </div>
        <div style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
          <h3 style={{ fontFamily: "var(--font-page-display), sans-serif", fontSize: 'clamp(18px, 2.2vw, 25px)', letterSpacing: '0.02em', color: '#f0eeff', lineHeight: 1, margin: 0 }}>{p.title}</h3>
          <p style={{ fontSize: '11px', fontFamily: "'Barlow', sans-serif", color: '#6a5e94', lineHeight: 1.8, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>{p.fullDesc}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {p.tags.map(t => (<span key={t} style={{ fontSize: '8.5px', fontFamily: "'Barlow', sans-serif", fontWeight: 700, padding: '2px 8px', borderRadius: '3px', letterSpacing: '0.09em', textTransform: 'uppercase', color: p.accentColor, border: `1px solid ${p.accentColor}33`, background: `${p.accentColor}0d` }}>{t}</span>))}
          </div>
          <div style={{ height: '1px', background: `${p.accentColor}18` }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <a href={p.liveUrl} style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '9px 0', borderRadius: '8px', fontFamily: "var(--font-page-display), sans-serif", fontSize: '11px', letterSpacing: '0.04em', textDecoration: 'none', background: `linear-gradient(135deg, ${p.accentColor}cc, ${p.accentColor}88)`, color: '#fff', boxShadow: `0 0 16px ${p.accentColor}44`, transition: 'transform 0.15s, box-shadow 0.15s' }} target="_blank" rel="noreferrer">Live Demo</a>
            <a href={p.repoUrl} style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '9px 0', borderRadius: '8px', fontFamily: "var(--font-page-display), sans-serif", fontSize: '11px', letterSpacing: '0.04em', textDecoration: 'none', background: 'rgba(11,10,26,0.9)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.25)', transition: 'border-color 0.15s, color 0.15s' }} target="_blank" rel="noreferrer">View Code</a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── RESUME DATA ────────────────────────────── */
const RESUME_DATA = {
  name: 'James A. Agbo',
  title: 'Information Technology Student & Developer',
  location: 'Montalban, Rizal, Philippines',
  email: 'agbojames00@gmail.com',
  phone: '+63 960 853 3007',
  linkedin: 'linkedin.com/in/agbo-james-ba5b34413',
  summary: 'Motivated Information Technology undergraduate at Colegio de Montalban with expertise in programming, web development, and software design. Proficient in creating responsive web applications, writing clean and efficient code, and applying problem-solving skills to develop practical technology solutions.',
  skills: {
    languages: ['HTML', 'CSS', 'PHP', 'JavaScript', 'Python', 'C#', 'C++'],
    frameworks: ['Vue.js', 'React Native', 'Next.js', 'Electron.js', 'Tailwind CSS', 'Bootstrap', 'Django'],
    databases: ['MySQL', 'PostgreSQL', 'SQLite', 'MongoDB', 'Supabase'],
    tools: ['AWS', 'Git', 'GitHub', 'Postman', 'Vercel', 'Brevo', 'Figma'],
  },
  experience: [{ role: 'Intern – Web Developer', company: 'Elevate Solutions Experts', location: 'Montalban, Rizal', period: 'Jan 2026 – Apr 2026', points: ['Assisted in developing web applications using Python, Vue.js and AWS.', 'Improved UI components for better user experience.', 'Managed and updated databases for system support.', 'Fixed bugs and improved system performance.', 'Collaborated with developers on feature implementation.'] }],
  education: [
    { degree: 'BS Information Technology', school: 'Colegio de Montalban', period: '2022–2026' },
    { degree: 'Senior High School – ICT Strand', school: 'South East Asia Institute of Trade and Technology', period: '2020–2022' },
  ],
  projects: PROJECTS.map(p => ({ title: p.title, role: p.role, tags: p.tags, desc: p.fullDesc })),
};

function downloadResume() {
  const link = document.createElement('a');
  link.href = '/resume-james-agbo.pdf';
  link.download = 'resume-james-agbo.pdf';
  document.body.appendChild(link); link.click(); document.body.removeChild(link);
}

function downloadCSV() {
  const rows = [
    ['Field', 'Value'], ['Name', RESUME_DATA.name], ['Title', RESUME_DATA.title],
    ['Location', RESUME_DATA.location], ['Email', RESUME_DATA.email], ['Phone', RESUME_DATA.phone],
    ['LinkedIn', RESUME_DATA.linkedin], ['Summary', RESUME_DATA.summary], [''],
    ['SKILLS – Languages', RESUME_DATA.skills.languages.join(' | ')],
    ['SKILLS – Frameworks', RESUME_DATA.skills.frameworks.join(' | ')],
    ['SKILLS – Databases', RESUME_DATA.skills.databases.join(' | ')],
    ['SKILLS – Tools', RESUME_DATA.skills.tools.join(' | ')], [''],
    ['EXPERIENCE', ''], ...RESUME_DATA.experience.map(e => [e.role, `${e.company} · ${e.period}`]), [''],
    ['PROJECTS', ''], ...RESUME_DATA.projects.map(p => [p.title, `${p.role} — ${p.tags.join(', ')}`]), [''],
    ['EDUCATION', ''], ...RESUME_DATA.education.map(e => [e.degree, `${e.school} · ${e.period}`]),
  ];
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'james-agbo-profile.csv'; a.click(); URL.revokeObjectURL(url);
}

/* ─────────────────────────── WHY HIRE ME PANEL ──────────────────────────── */
const WHY_HIRE = [
  {
    icon: (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>),
    color: '#a78bfa', glow: 'rgba(167,139,250,0.35)',
    title: 'Full-Stack Capable',
    desc: 'From pixel-perfect frontends to robust backends — I own the whole build. Vue, React, PHP, Python, Django. I don\'t stop at "my layer".',
  },
  {
    icon: (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>),
    color: '#22d3ee', glow: 'rgba(34,211,238,0.35)',
    title: 'Ships Fast, Ships Clean',
    desc: 'Real projects delivered — not just tutorials. 6 production apps across catering, job platforms, and community tools. Lighthouse 97. 38 tests passing.',
  },
  {
    icon: (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/><path d="M15.54 8.46a5 5 0 010 7.07M8.46 8.46a5 5 0 000 7.07"/></svg>),
    color: '#34d399', glow: 'rgba(52,211,153,0.35)',
    title: 'Cloud & DevOps Ready',
    desc: 'Deployed on AWS, Vercel, Docker. Worked with Supabase realtime, PostgreSQL, CI pipelines, and automated test coverage in a real internship.',
  },
  {
    icon: (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>),
    color: '#f472b6', glow: 'rgba(244,114,182,0.35)',
    title: 'Team-Proven',
    desc: '7 months at Elevate Solutions Experts collaborating with senior devs. Code reviews, feature sprints, bug triage. I know how real teams work.',
  },
  {
    icon: (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>),
    color: '#fbbf24', glow: 'rgba(251,191,36,0.35)',
    title: 'Design-Conscious',
    desc: 'Figma to code, responsive layouts, accessibility-aware. I don\'t just make things work — I make them look like they were made by someone who cares.',
  },
  {
    icon: (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>),
    color: '#818cf8', glow: 'rgba(129,140,248,0.35)',
    title: 'Always Learning',
    desc: 'Graduating 2026, already working with AI APIs, modern cloud infra, and multi-platform builds. I stay ahead — not because I have to, but because I want to.',
  },
];

function WhyHireMe() {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontFamily: "var(--font-page-display), sans-serif", fontSize: 'clamp(22px, 2.4vw, 32px)', letterSpacing: '0.02em', color: '#f0eeff', lineHeight: 1, marginBottom: '8px' }}>
          Why Hire{' '}<span style={{ background: 'linear-gradient(135deg, #a78bfa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Me?</span>
        </div>
        <p style={{ fontSize: '11px', fontFamily: "'Barlow', sans-serif", color: '#4c3d7a', lineHeight: 1.75, maxWidth: '420px' }}>Not just a list of languages. Here&apos;s what I actually bring to the table.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {WHY_HIRE.map((item, i) => {
          const isHov = hovered === i;
          return (
            <div key={item.title} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
              style={{ background: isHov ? `linear-gradient(135deg, ${item.color}12, rgba(8,7,26,0.95))` : 'rgba(8,7,26,0.7)', border: `1px solid ${isHov ? item.color + '55' : item.color + '1a'}`, borderRadius: '14px', padding: '18px 16px', cursor: 'default', transition: 'all 0.3s cubic-bezier(0.34,1.2,0.64,1)', boxShadow: isHov ? `0 0 24px ${item.glow}, 0 8px 32px rgba(0,0,0,0.4)` : '0 4px 16px rgba(0,0,0,0.2)', transform: isHov ? 'translateY(-3px)' : 'translateY(0)', position: 'relative', overflow: 'hidden', backdropFilter: 'blur(8px)' }}>
              {isHov && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${item.color}, transparent)`, boxShadow: `0 0 8px ${item.color}` }} />}
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${item.color}15`, border: `1px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, marginBottom: '12px', boxShadow: isHov ? `0 0 14px ${item.glow}` : 'none', transition: 'box-shadow 0.3s ease' }}>{item.icon}</div>
              <div style={{ fontFamily: "var(--font-page-display), sans-serif", fontSize: '12px', letterSpacing: '0.04em', color: isHov ? '#f0eeff' : '#c4b5fd', lineHeight: 1, marginBottom: '7px', transition: 'color 0.2s' }}>{item.title}</div>
              <p style={{ fontSize: '10.5px', fontFamily: "'Barlow', sans-serif", color: isHov ? '#8b7ec8' : '#4c3d7a', lineHeight: 1.7, margin: 0, transition: 'color 0.2s' }}>{item.desc}</p>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', borderRadius: '12px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', backdropFilter: 'blur(8px)' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399', flexShrink: 0, display: 'inline-block', animation: 'termPulse 1.6s ease-in-out infinite' }} />
        <span style={{ fontSize: '9px', fontFamily: "'Barlow', sans-serif", fontWeight: 600, color: '#7c5cbf', letterSpacing: '0.03em', flex: 1 }}>Open to internships, full-time roles, and freelance projects — let&apos;s talk.</span>
        <a href="#hire" style={{ fontFamily: "var(--font-page-display), sans-serif", fontSize: '11px', letterSpacing: '0.04em', color: '#a78bfa', textDecoration: 'none', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '6px', padding: '5px 12px', transition: 'all 0.2s', flexShrink: 0 }}>Hire Me →</a>
      </div>
    </div>
  );
}

/* ─────────────────────────────── RESUME SECTION ────────────────────────── */
function ResumeDownloadSection() {
  return (
    <section id="resume" style={{ background: '#0e0c1f', padding: '60px 6vw', borderTop: '1px solid rgba(139,92,246,0.08)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <p className="reveal" style={{ fontSize: '9px', fontFamily: "var(--font-page-display), sans-serif", color: '#7c3aed', letterSpacing: '0.22em', marginBottom: '6px' }}>05 — Resume</p>
        <h2 className="reveal" style={{ fontFamily: "var(--font-page-orbitron), sans-serif", fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 700, letterSpacing: '0.01em', color: '#f0eeff', marginBottom: '40px' }}>
          My{' '}<span style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Credentials</span>
        </h2>
        <div className="reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'stretch' }}>
          <div style={{ background: '#08071a', border: '1px solid rgba(139,92,246,0.14)', borderRadius: '16px', padding: '28px 28px 24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <img src="/pormal_picture.jpg" alt="James A. Agbo" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid rgba(167,139,250,0.3)' }} />
              <div>
                <div style={{ fontFamily: "var(--font-page-display), sans-serif", fontSize: '12px', letterSpacing: '0.03em', color: '#f0eeff', lineHeight: 1 }}>James A. Agbo</div>
                <div style={{ fontSize: '10px', fontFamily: "'Barlow', sans-serif", fontWeight: 700, color: '#a78bfa', letterSpacing: '0.03em', textTransform: 'uppercase', marginTop: '2px' }}>IT Student · Developer</div>
              </div>
            </div>
            <p style={{ fontSize: '11px', fontFamily: "'Barlow', sans-serif", color: '#5a4e80', lineHeight: 1.85, marginBottom: '20px' }}>{RESUME_DATA.summary}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {[
                { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>, label: 'Montalban, Rizal, Philippines' },
                { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label: 'agbojames00@gmail.com' },
                { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>, label: 'Colegio de Montalban – BS IT, 2022–2026' },
                { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>, label: 'Open to Internships & Entry-Level Roles' },
              ].map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3d3066' }}>
                  {m.icon}<span style={{ fontSize: '9px', fontFamily: "'Barlow', sans-serif", fontWeight: 500, color: '#6d5e9c' }}>{m.label}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid rgba(139,92,246,0.1)', paddingTop: '16px' }}>
              {[
                { label: 'Languages', tags: RESUME_DATA.skills.languages, color: '#818cf8' },
                { label: 'Frameworks', tags: RESUME_DATA.skills.frameworks, color: '#a78bfa' },
                { label: 'Databases', tags: RESUME_DATA.skills.databases, color: '#34d399' },
                { label: 'Tools', tags: RESUME_DATA.skills.tools, color: '#22d3ee' },
              ].map(g => (
                <div key={g.label} style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '9px', fontFamily: "'Barlow', sans-serif", fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: g.color, marginBottom: '5px' }}>{g.label}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {g.tags.map(t => (<span key={t} style={{ fontSize: '8.5px', fontFamily: "'Barlow', sans-serif", fontWeight: 700, padding: '2px 7px', borderRadius: '3px', letterSpacing: '0.04em', textTransform: 'uppercase', color: g.color, border: `1px solid ${g.color}33`, background: `${g.color}0d` }}>{t}</span>))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
            <div style={{ background: '#08071a', border: '1px solid rgba(139,92,246,0.14)', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #a78bfa, #7c3aed)' }} />
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontFamily: "var(--font-page-display), sans-serif", fontSize: '17px', letterSpacing: '0.04em', color: '#f0eeff', marginBottom: '4px' }}>Resume</div>
                <p style={{ fontSize: '9px', fontFamily: "'Barlow', sans-serif", color: '#4c3d7a', lineHeight: 1.7 }}>Full resume as a PDF — includes summary, experience, projects, skills, and education. Print-ready.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                {['PDF', 'Print-Ready', 'ATS-Friendly'].map(b => (<span key={b} style={{ fontSize: '8px', fontFamily: "'Barlow', sans-serif", fontWeight: 700, padding: '2px 8px', borderRadius: '3px', letterSpacing: '0.03em', textTransform: 'uppercase', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.25)', background: 'rgba(167,139,250,0.07)' }}>{b}</span>))}
              </div>
              <div className="tooltip-btn-wrap">
                <button className="uv-tooltip-btn uv-tooltip-btn--purple" onClick={downloadResume}>
                  <span className="uv-tooltip">Download Resume</span>
                  <span className="uv-tooltip-label"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Download Resume</span>
                </button>
              </div>
            </div>
            <div style={{ background: '#08071a', border: '1px solid rgba(34,211,238,0.12)', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #22d3ee, #0e7490)' }} />
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontFamily: "var(--font-page-display), sans-serif", fontSize: '17px', letterSpacing: '0.04em', color: '#f0eeff', marginBottom: '4px' }}>Profile Data</div>
                <p style={{ fontSize: '9px', fontFamily: "'Barlow', sans-serif", color: '#4c3d7a', lineHeight: 1.7 }}>Structured CSV export of all profile data — ideal for ATS systems, spreadsheets, or recruiters&apos; pipelines.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                {['CSV', 'ATS-Friendly', 'Structured'].map(b => (<span key={b} style={{ fontSize: '8px', fontFamily: "'Barlow', sans-serif", fontWeight: 700, padding: '2px 8px', borderRadius: '3px', letterSpacing: '0.03em', textTransform: 'uppercase', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.22)', background: 'rgba(34,211,238,0.06)' }}>{b}</span>))}
              </div>
              <div className="tooltip-btn-wrap">
                <button className="uv-tooltip-btn uv-tooltip-btn--cyan" onClick={downloadCSV}>
                  <span className="uv-tooltip uv-tooltip--cyan">Download CSV</span>
                  <span className="uv-tooltip-label"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Download CSV</span>
                </button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
              {[{ val: '6', label: 'Projects', color: '#a78bfa' }, { val: '7mo', label: 'Internship', color: '#22d3ee' }, { val: '15+', label: 'Technologies', color: '#34d399' }].map(s => (
                <div key={s.label} style={{ background: '#08071a', border: `1px solid ${s.color}18`, borderRadius: '10px', padding: '12px 10px', textAlign: 'center' }}>
                  <div style={{ fontFamily: "var(--font-page-display), sans-serif", fontSize: '21px', color: s.color, letterSpacing: '0.02em', lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: '8px', fontFamily: "'Barlow', sans-serif", fontWeight: 700, color: '#3d3066', letterSpacing: '0.03em', textTransform: 'uppercase', marginTop: '3px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── HIRE ME (with real EmailJS) ──────────────────────────────────── */
/*
  To wire up real email:
  1. Go to https://www.emailjs.com/ and create a free account
  2. Add a new Email Service (Gmail works)
  3. Create an Email Template with variables: {{from_name}}, {{from_email}}, {{role}}, {{message}}
  4. Get your PUBLIC KEY from Account > API Keys
  5. Replace the placeholders below:
     - YOUR_PUBLIC_KEY
     - YOUR_SERVICE_ID
     - YOUR_TEMPLATE_ID
  6. Run: npm install @emailjs/browser
  7. Uncomment the emailjs import and replace the fake setTimeout in handleSubmit
*/

function HireMeSection() {
  const [form, setForm] = useState({ name: '', email: '', role: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in name, email, and message.');
      return;
    }
    setError('');
    setSending(true);

    /* ── OPTION A: EmailJS (real emails) ──
    // npm install @emailjs/browser first, then uncomment:
    //
    // import emailjs from '@emailjs/browser';
    //
    // try {
    //   await emailjs.send(
    //     'YOUR_SERVICE_ID',
    //     'YOUR_TEMPLATE_ID',
    //     { from_name: form.name, from_email: form.email, role: form.role, message: form.message },
    //     'YOUR_PUBLIC_KEY'
    //   );
    //   setSubmitted(true);
    // } catch {
    //   setError('Failed to send. Please email me directly at agbojames00@gmail.com');
    // } finally {
    //   setSending(false);
    // }
    */

    /* ── OPTION B: Formspree (no npm needed) ──
    // Replace YOUR_FORM_ID from https://formspree.io
    //
    // const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name: form.name, email: form.email, role: form.role, message: form.message }),
    // });
    // if (res.ok) { setSubmitted(true); } else { setError('Failed to send. Try agbojames00@gmail.com'); }
    // setSending(false);
    */

    // ── PLACEHOLDER (remove when using EmailJS or Formspree above) ──
    setTimeout(() => { setSending(false); setSubmitted(true); }, 1400);
  };

  return (
    <section id="hire" style={{ background: '#07061a', padding: '80px 6vw', borderTop: '1px solid rgba(139,92,246,0.08)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: '700px', height: '700px', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(ellipse at center, rgba(109,40,217,0.13) 0%, rgba(34,211,238,0.04) 50%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', top: '-10%', right: '5%', background: 'radial-gradient(ellipse at center, rgba(167,139,250,0.08) 0%, transparent 70%)', borderRadius: '50%', animation: 'orbFloat1 16s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: '300px', height: '300px', bottom: '-5%', left: '8%', background: 'radial-gradient(ellipse at center, rgba(34,211,238,0.07) 0%, transparent 70%)', borderRadius: '50%', animation: 'orbFloat3 12s ease-in-out infinite' }} />
      </div>
      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <p className="reveal" style={{ fontSize: '9px', fontFamily: "var(--font-page-display), sans-serif", color: '#7c3aed', letterSpacing: '0.22em', marginBottom: '6px' }}>06 — Why Me &amp; Hire</p>
        <h2 className="reveal" style={{ fontFamily: "var(--font-page-orbitron), sans-serif", fontSize: 'clamp(27px, 3.2vw, 42px)', fontWeight: 700, letterSpacing: '0.01em', color: '#f0eeff', marginBottom: '10px' }}>
          Work With{' '}<span style={{ background: 'linear-gradient(135deg, #a78bfa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Me</span>
        </h2>
        <p className="reveal" style={{ fontSize: '11px', fontFamily: "'Barlow', sans-serif", color: '#5a4e80', maxWidth: '480px', lineHeight: 1.8, marginBottom: '48px' }}>Here&apos;s what I bring — and how you can get in touch. Fill in the form and I&apos;ll get back within 24 hours.</p>
        <div className="reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
          <WhyHireMe />
          <div style={{ background: 'rgba(8,7,26,0.85)', border: '1px solid rgba(139,92,246,0.18)', borderRadius: '20px', padding: '36px 32px', position: 'relative', overflow: 'hidden', backdropFilter: 'blur(12px)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #7c3aed, #a78bfa, #22d3ee, #7c3aed)', backgroundSize: '200% 100%', animation: 'shimmerBorder 3s linear infinite' }} />
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(52,211,153,0.15)', border: '2px solid #34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div style={{ fontFamily: "var(--font-page-display), sans-serif", fontSize: '22px', letterSpacing: '0.03em', color: '#34d399', marginBottom: '8px' }}>Message Sent!</div>
                <p style={{ fontSize: '11px', fontFamily: "'Barlow', sans-serif", color: '#5a4e80', lineHeight: 1.7 }}>Thanks for reaching out. I&apos;ll get back to you at <strong style={{ color: '#a78bfa' }}>{form.email}</strong> shortly.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', role: '', message: '' }); }} style={{ marginTop: '24px', background: 'none', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px', padding: '8px 20px', color: '#a78bfa', fontFamily: "var(--font-page-display), sans-serif", fontSize: '11px', letterSpacing: '0.04em', cursor: 'pointer' }}>Send Another</button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontFamily: "var(--font-page-display), sans-serif", fontSize: '21px', letterSpacing: '0.03em', color: '#f0eeff', lineHeight: 1, marginBottom: '6px' }}>Hire Me</div>
                  <p style={{ fontSize: '9px', fontFamily: "'Barlow', sans-serif", color: '#4c3d7a', lineHeight: 1.7 }}>Available for internships, freelance projects, and entry-level roles. Let&apos;s build something great.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="hire-field-wrap"><label className="hire-label">Your Name</label><input type="text" placeholder="e.g. Maria Santos" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="hire-input" /></div>
                    <div className="hire-field-wrap"><label className="hire-label">Email</label><input type="email" placeholder="you@company.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="hire-input" /></div>
                  </div>
                  <div className="hire-field-wrap">
                    <label className="hire-label">Opportunity Type</label>
                    <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="hire-input hire-select">
                      <option value="">Select type...</option>
                      <option value="fulltime">Full-Time Role</option>
                      <option value="internship">Internship</option>
                      <option value="freelance">Freelance Project</option>
                      <option value="parttime">Part-Time</option>
                      <option value="collab">Collaboration</option>
                    </select>
                  </div>
                  <div className="hire-field-wrap"><label className="hire-label">Message</label><textarea placeholder="Tell me about the opportunity, tech stack, timeline..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="hire-input hire-textarea" rows={4} /></div>
                  {error && <p style={{ fontSize: '10px', fontFamily: "'Barlow', sans-serif", color: '#f87171', margin: 0 }}>{error}</p>}
                  <div className="tooltip-btn-wrap" style={{ marginTop: '4px' }}>
                    <button className={`uv-tooltip-btn uv-tooltip-btn--gradient${sending ? ' uv-sending' : ''}`} onClick={handleSubmit} disabled={sending} style={{ width: '100%' }}>
                      <span className="uv-tooltip uv-tooltip--gradient">I&apos;ll respond within 24h!</span>
                      <span className="uv-tooltip-label" style={{ width: '100%', justifyContent: 'center' }}>
                        {sending ? (<><svg style={{ animation: 'spin 0.8s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>Sending...</>) : (<><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>Send Message</>)}
                      </span>
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginTop: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399', display: 'inline-block', animation: 'termPulse 2s ease-in-out infinite' }} />
                    <span style={{ fontSize: '10px', fontFamily: "'Barlow', sans-serif", color: '#3d3066', letterSpacing: '0.04em' }}>Available for new opportunities</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── HOME ───────────────────────────────────── */
export default function Home() {
  const [portfolioReady, setPortfolioReady] = useState(false);
  const typed = useTypewriter();

  useEffect(() => {
    if (!portfolioReady) return;
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => (e.target as HTMLElement).classList.add('visible'), i * 100);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [portfolioReady]);

  useEffect(() => {
    if (!portfolioReady) return;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      document.querySelectorAll<HTMLElement>('.hero-bg-orb').forEach((el, i) => {
        el.style.transform = `translateY(${scrollY * (0.08 + i * 0.04)}px)`;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [portfolioReady]);

  return (
    <>
      {!portfolioReady && <LoadingScreen onComplete={() => setPortfolioReady(true)} />}
      <CustomCursor />

      <div className={`${bebasNeue.variable} ${orbitron.variable} portfolio-root${portfolioReady ? ' portfolio-root--in' : ''}`}>

        {/* ── HERO ── */}
        <section style={{ minHeight: '100vh', background: '#0b0a1a', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', padding: '0 6vw 20px' }}>
          <nav style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 6vw' }}>
            <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="/logo.jpg" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(139,92,246,0.4)' }} />
              <span style={{ fontFamily: "var(--font-page-display), sans-serif", fontSize: '11px', letterSpacing: '0.04em', color: '#f0eeff' }}>James A. Agbo</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              {['About', 'Skills', 'Experience', 'Projects', 'Resume', 'Hire', 'Contact'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="nav-link" style={{ fontFamily: "var(--font-page-orbitron), sans-serif", fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', color: '#a78bfa', textDecoration: 'none', position: 'relative', paddingBottom: '4px' }}>{item}</a>
              ))}
            </div>
          </nav>

          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
            <div className="hero-bg-orb orb-1" />
            <div className="hero-bg-orb orb-2" />
            <div className="hero-bg-orb orb-3" />
            <div className="hero-bg-orb orb-4" />
          </div>

          <div style={{ maxWidth: '1300px', width: '100%', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
            <div className="hero-left" style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingRight: '4rem', paddingTop: '100px' }}>
              <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', width: 'fit-content' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a78bfa', boxShadow: '0 0 8px #a78bfa' }} />
                <span style={{ fontSize: '9px', fontFamily: "var(--font-page-display), sans-serif", color: '#a78bfa', letterSpacing: '0.12em' }}>Portfolio · 2026</span>
              </div>
              <h1 className="hero-heading" style={{ fontFamily: "var(--font-page-orbitron), sans-serif", fontSize: 'clamp(34px, 4.2vw, 54px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '0', color: '#f0eeff' }}>
                Building{' '}<span style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Complete</span>
                <br />Solutions From<br />
                <span style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'inline-block', minWidth: '4px' }}>
                  {typed}<span className="cursor" style={{ display: 'inline-block', width: '3px', height: '0.85em', background: '#a78bfa', marginLeft: '4px', verticalAlign: 'text-bottom', borderRadius: '1px' }} />
                </span>
              </h1>
              <p className="hero-desc" style={{ fontSize: '14px', fontFamily: "'Barlow', sans-serif", fontWeight: 500, color: '#9d8fc4', lineHeight: 1.75, maxWidth: '480px' }}>
                I&apos;m James A. Agbo — an IT student and developer who builds real-world applications from intuitive interfaces to reliable back-end systems.
              </p>
              <div className="hero-btns" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <a href="#projects" className="hero-btn hero-btn--ghost">View Work</a>
                <a href="#contact" className="hero-btn hero-btn--solid">Get In Touch</a>
              </div>
              <div className="hero-stats" style={{ display: 'flex', gap: '2rem', marginTop: '4px', paddingTop: '16px', borderTop: '1px solid rgba(139,92,246,0.15)' }}>
                {[{ val: '6', label: 'Projects' }, { val: '15+', label: 'Technologies' }, { val: '7mo', label: 'Internship' }].map(s => (
                  <div key={s.label} className="stat-item" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span className="stat-val" style={{ fontFamily: "var(--font-page-display), sans-serif", fontSize: '26px', fontWeight: 400, color: '#f0eeff', lineHeight: 1, letterSpacing: '0.02em' }}>{s.val}</span>
                    <span style={{ fontSize: '10px', fontFamily: "'Barlow', sans-serif", fontWeight: 600, color: '#6d5e9c', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
              <div style={{ flex: 1, position: 'relative', marginTop: '40px' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(109,40,217,0.2) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 1 }} />
                <DotParticles />
                <AIGlitchOverlay />
                <SplineErrorBoundary fallback={<SplineFallback />}>
                  <Spline scene="https://prod.spline.design/GQHPfuRVLvBfGYh8/scene.splinecode" style={{ width: '100%', height: '100%' }} />
                </SplineErrorBoundary>
                <div style={{ position: 'absolute', bottom: '20px', right: 0, width: '30%', height: '36px', background: '#0b0a1a', zIndex: 10 }} />
              </div>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 2 }}>
            <span style={{ fontSize: '9px', fontFamily: "'Barlow', sans-serif", fontWeight: 600, color: '#4c3d7a', letterSpacing: '0.18em', textTransform: 'uppercase' }}>scroll</span>
            <div className="scroll-line" style={{ width: '1px', height: '30px', background: 'linear-gradient(to bottom, #7c3aed, transparent)' }} />
          </div>
        </section>

        {/* ── ABOUT ME ── */}
        <section id="about" style={{ background: '#0b0a1a', padding: '60px 6vw', borderTop: '1px solid rgba(139,92,246,0.08)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <p className="reveal" style={{ fontSize: '9px', fontFamily: "var(--font-page-display), sans-serif", color: '#7c3aed', letterSpacing: '0.22em', marginBottom: '6px' }}>01 — About Me</p>
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 220px', gap: '48px', alignItems: 'start' }}>
              <div className="reveal reveal--left" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <GlitchPhotoCard />
                <div style={{ display: 'flex', gap: '8px', position: 'relative', zIndex: 20 }}>
                  {[
                    { label: 'GitHub', href: '#', color: '#e2e8f0', border: 'rgba(226,232,240,0.25)', bg: 'rgba(226,232,240,0.07)', glow: 'rgba(226,232,240,0.15)', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg> },
                    { label: 'LinkedIn', href: 'https://linkedin.com/in/agbo-james-ba5b34413', color: '#60a5fa', border: 'rgba(96,165,250,0.35)', bg: 'rgba(96,165,250,0.1)', glow: 'rgba(96,165,250,0.25)', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                    { label: 'Twitter', href: '#', color: '#818cf8', border: 'rgba(129,140,248,0.35)', bg: 'rgba(129,140,248,0.1)', glow: 'rgba(129,140,248,0.25)', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                    { label: 'Email', href: 'mailto:agbojames00@gmail.com', color: '#34d399', border: 'rgba(52,211,153,0.35)', bg: 'rgba(52,211,153,0.1)', glow: 'rgba(52,211,153,0.25)', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
                  ].map(s => (
                    <a key={s.label} href={s.href} title={s.label} className="social-btn" style={{ flex: 1, height: '38px', borderRadius: '10px', border: `1px solid ${s.border}`, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, textDecoration: 'none', boxShadow: `0 0 10px ${s.glow}, inset 0 0 8px ${s.glow}`, transition: 'transform 0.2s, box-shadow 0.2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 18px ${s.glow}, inset 0 0 12px ${s.glow}`; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 10px ${s.glow}, inset 0 0 8px ${s.glow}`; }}
                    >{s.icon}</a>
                  ))}
                </div>
              </div>

              <div className="reveal reveal--up" style={{ paddingTop: '4px' }}>
                <h2 style={{ fontFamily: "var(--font-page-display), sans-serif", fontSize: 'clamp(27px, 3.2vw, 42px)', fontWeight: 400, letterSpacing: '0.01em', color: '#f0eeff', lineHeight: 1, marginBottom: '8px' }}>
                  James{' '}<span style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Agbo</span>
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
                  <span style={{ fontSize: '9px', fontFamily: "'Barlow', sans-serif", fontWeight: 700, color: '#7c5cbf', letterSpacing: '0.12em', textTransform: 'uppercase' }}>IT Student · Developer</span>
                  <span style={{ width: '1px', height: '12px', background: 'rgba(139,92,246,0.2)' }} />
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontFamily: "'Barlow', sans-serif", fontWeight: 600, color: '#22d3ee', letterSpacing: '0.04em' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 6px #22d3ee', display: 'inline-block', animation: 'termPulse 1.4s ease-in-out infinite' }} />
                    Open to opportunities
                  </span>
                </div>
                <p style={{ fontSize: '11px', fontFamily: "'Barlow', sans-serif", fontWeight: 400, color: '#7a6ca8', lineHeight: 1.9, marginBottom: '16px', maxWidth: '520px' }}>
                  Based in Montalban, Rizal, I&apos;m finishing my BS in Information Technology at Colegio de Montalban. I build complete web applications — from polished user interfaces to reliable server infrastructure — using modern tools across the full stack.
                </p>
                <p style={{ fontSize: '11px', fontFamily: "'Barlow', sans-serif", fontWeight: 400, color: '#5a4e80', lineHeight: 1.9, maxWidth: '520px', marginBottom: '28px' }}>
                  Recently completed a 4-month internship at Elevate Solutions Experts where I worked on Python and Vue.js web apps deployed on AWS. I care about clean code, good architecture, and shipping things that actually work.
                </p>
                <CurrentlyBuilding />
                <div style={{ height: '1px', background: 'rgba(139,92,246,0.1)', margin: '28px 0' }} />
                <div style={{ display: 'flex', gap: '40px' }}>
                  {[
                    { label: 'Location', val: 'Montalban, Rizal', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg> },
                    { label: 'School', val: 'Colegio de Montalban', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg> },
                    { label: 'Graduating', val: '2026', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
                  ].map(m => (
                    <div key={m.label} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#3d3066' }}>{m.icon}<span style={{ fontSize: '9px', fontFamily: "'Barlow', sans-serif", fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#3d3066' }}>{m.label}</span></div>
                      <span style={{ fontSize: '11px', fontFamily: "'Barlow', sans-serif", fontWeight: 500, color: '#9d8fc4' }}>{m.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <LiveTerminal />
            </div>
          </div>
        </section>

        {/* ── SKILLS ── */}
        <SkillsSection />

        {/* ── EXPERIENCE / EDUCATION TIMELINE ── */}
        <TimelineSection />

        {/* ── PROJECTS — STICKY SCROLL ── */}
        <section id="projects" style={{ background: '#0b0a1a', borderTop: '1px solid rgba(139,92,246,0.08)' }}>
          <StickyProjectsShowcase />
        </section>

        {/* ── RESUME DOWNLOAD ── */}
        <ResumeDownloadSection />

        {/* ── WHY ME / HIRE ME ── */}
        <HireMeSection />

        {/* ── CONTACT ── */}
        <section id="contact" style={{ background: '#0e0c1f', padding: '60px 6vw', borderTop: '1px solid rgba(139,92,246,0.08)', textAlign: 'center' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <p className="reveal" style={{ fontSize: '9px', fontFamily: "var(--font-page-display), sans-serif", color: '#7c3aed', letterSpacing: '0.22em', marginBottom: '10px' }}>07 — Contact</p>
            <h2 className="reveal" style={{ fontFamily: "var(--font-page-orbitron), sans-serif", fontSize: 'clamp(30px, 4.2vw, 52px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '0.01em', color: '#f0eeff', marginBottom: '16px' }}>
              Let&apos;s build something{' '}<span style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>together.</span>
            </h2>
            <a href="mailto:agbojames00@gmail.com" className="reveal" style={{ display: 'inline-block', fontSize: 'clamp(13px, 2vw, 18px)', fontFamily: "'Barlow', sans-serif", fontWeight: 600, color: '#a78bfa', textDecoration: 'none', borderBottom: '1px solid rgba(167,139,250,0.3)', paddingBottom: '4px', marginBottom: '28px' }}>agbojames00@gmail.com</a>
            <div className="reveal" style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem' }}>
              {['GitHub', 'LinkedIn', 'Twitter'].map(s => (<a key={s} href={s === 'LinkedIn' ? 'https://linkedin.com/in/agbo-james-ba5b34413' : '#'} style={{ fontSize: '11px', fontFamily: "var(--font-page-display), sans-serif", color: '#4c3d7a', textDecoration: 'none', letterSpacing: '0.12em' }}>{s}</a>))}
            </div>
            <p className="reveal" style={{ marginTop: '60px', fontSize: '9px', fontFamily: "'Barlow', sans-serif", fontWeight: 500, color: '#2a2050' }}>© 2026 James A. Agbo. All rights reserved.</p>
          </div>
        </section>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 100%; height: 100%; background: #0b0a1a; overflow-x: hidden; scroll-behavior: smooth; cursor: none; }

        /* ════ CUSTOM CURSOR ════ */
        .cursor-dot { position:fixed; top:0; left:0; width:8px; height:8px; border-radius:50%; background:#a78bfa; pointer-events:none; z-index:99999; box-shadow:0 0 8px #a78bfa; transition:width 0.15s,height 0.15s,background 0.15s; will-change:transform; }
        .cursor-ring { position:fixed; top:0; left:0; width:36px; height:36px; border-radius:50%; border:1.5px solid rgba(167,139,250,0.5); pointer-events:none; z-index:99998; will-change:transform; transition:border-color 0.2s,width 0.2s,height 0.2s; }
        .cursor-dot--hover { width:12px; height:12px; background:#22d3ee; box-shadow:0 0 12px #22d3ee; }
        .cursor-ring--hover { width:48px; height:48px; border-color:rgba(34,211,238,0.5); }

        /* ════ PORTFOLIO FADE-IN ════ */
        .portfolio-root { opacity: 0; }
        .portfolio-root--in { animation: portfolioReveal 1.2s cubic-bezier(0.4,0,0.2,1) forwards; }
        @keyframes portfolioReveal { 0%{opacity:0;transform:translateY(16px) scale(0.99)} 100%{opacity:1;transform:translateY(0) scale(1)} }

        /* ════ HERO ENTRANCE ANIMATIONS ════ */
        .portfolio-root--in .hero-badge  { animation: slideInUp 0.7s cubic-bezier(0.34,1.4,0.64,1) 0.2s  both; }
        .portfolio-root--in .hero-heading{ animation: slideInUp 0.8s cubic-bezier(0.34,1.3,0.64,1) 0.35s both; }
        .portfolio-root--in .hero-desc   { animation: slideInUp 0.7s cubic-bezier(0.34,1.2,0.64,1) 0.5s  both; }
        .portfolio-root--in .hero-btns   { animation: slideInUp 0.7s cubic-bezier(0.34,1.2,0.64,1) 0.62s both; }
        .portfolio-root--in .hero-stats  { animation: slideInUp 0.7s cubic-bezier(0.34,1.2,0.64,1) 0.74s both; }
        .portfolio-root--in .nav-logo    { animation: slideInDown 0.7s cubic-bezier(0.34,1.3,0.64,1) 0.1s  both; }
        .portfolio-root--in .nav-link    { animation: slideInDown 0.6s cubic-bezier(0.34,1.2,0.64,1) both; }
        .portfolio-root--in .nav-link:nth-child(1){animation-delay:0.12s} .portfolio-root--in .nav-link:nth-child(2){animation-delay:0.18s} .portfolio-root--in .nav-link:nth-child(3){animation-delay:0.24s} .portfolio-root--in .nav-link:nth-child(4){animation-delay:0.30s} .portfolio-root--in .nav-link:nth-child(5){animation-delay:0.36s} .portfolio-root--in .nav-link:nth-child(6){animation-delay:0.42s} .portfolio-root--in .nav-link:nth-child(7){animation-delay:0.48s}
        .portfolio-root--in .scroll-line { animation: scrollLineGrow 1s ease-out 1.1s both; }

        @keyframes slideInUp   { 0%{opacity:0;transform:translateY(30px)}  100%{opacity:1;transform:translateY(0)} }
        @keyframes slideInDown { 0%{opacity:0;transform:translateY(-20px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes scrollLineGrow { 0%{opacity:0;transform:scaleY(0);transform-origin:top} 100%{opacity:1;transform:scaleY(1);transform-origin:top} }

        /* ════ HERO STAT SHIMMER ════ */
        .stat-item { position: relative; }
        .stat-val { background: linear-gradient(90deg, #f0eeff 30%, #a78bfa 50%, #f0eeff 70%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: statShimmer 4s linear infinite; }
        @keyframes statShimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }

        /* ════ CURSOR ════ */
        .cursor { animation: blink 0.9s step-end infinite; }
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }

        /* ════ HERO ORBS ════ */
        .hero-bg-orb { position:absolute; border-radius:50%; pointer-events:none; filter:blur(1px); will-change:transform; }
        .orb-1 { width:560px; height:560px; top:-12%; left:-6%; background:radial-gradient(circle,rgba(109,40,217,0.28) 0%,transparent 70%); animation:orbFloat1 12s ease-in-out infinite; }
        .orb-2 { width:420px; height:420px; bottom:-12%; right:28%; background:radial-gradient(circle,rgba(139,92,246,0.18) 0%,transparent 70%); animation:orbFloat2 16s ease-in-out infinite; }
        .orb-3 { width:300px; height:300px; top:30%; right:5%; background:radial-gradient(circle,rgba(34,211,238,0.1) 0%,transparent 70%); animation:orbFloat3 10s ease-in-out infinite; }
        .orb-4 { width:200px; height:200px; bottom:20%; left:20%; background:radial-gradient(circle,rgba(217,119,87,0.08) 0%,transparent 70%); animation:orbFloat4 14s ease-in-out infinite; }
        @keyframes orbFloat1 { 0%,100%{transform:translate(0px,0px) scale(1)} 25%{transform:translate(40px,30px) scale(1.06)} 50%{transform:translate(20px,60px) scale(0.96)} 75%{transform:translate(-20px,20px) scale(1.04)} }
        @keyframes orbFloat2 { 0%,100%{transform:translate(0px,0px) scale(1)} 33%{transform:translate(-50px,-30px) scale(1.08)} 66%{transform:translate(30px,-50px) scale(0.94)} }
        @keyframes orbFloat3 { 0%,100%{transform:translate(0px,0px)} 50%{transform:translate(-30px,40px) scale(1.12)} }
        @keyframes orbFloat4 { 0%,100%{transform:translate(0px,0px) scale(1)} 40%{transform:translate(30px,-20px) scale(1.1)} 80%{transform:translate(-10px,30px) scale(0.9)} }

        /* ════ REVEAL ════ */
        .reveal { opacity:0; transform:translateY(28px); transition:opacity 0.7s cubic-bezier(0.4,0,0.2,1),transform 0.7s cubic-bezier(0.4,0,0.2,1); }
        .reveal.visible { opacity:1; transform:translateY(0); }
        .reveal--left { transform:translateX(-32px); }
        .reveal--left.visible { transform:translateX(0); }
        .reveal--up { transform:translateY(40px); transition-duration:0.8s; }
        .reveal--up.visible { transform:translateY(0); }

        /* ════ NAV ════ */
        .nav-link::after { content:''; position:absolute; bottom:0; left:0; width:0; height:2px; background:linear-gradient(90deg,#a78bfa,#7c3aed); border-radius:2px; transition:width 0.3s; }
        .nav-link:hover::after { width:100%; }
        .nav-link:hover { color:#c4b5fd !important; }

        /* ════ AI CYBER PILLS ════ */
        .ai-cyber-pill { position:absolute; pointer-events:none; user-select:none; display:flex; align-items:center; gap:7px; padding:5px 11px 5px 8px; clip-path:polygon(0 0,90% 0,100% 20%,100% 100%,10% 100%,0 80%); background:rgba(11,10,26,0.72); border:1px solid var(--pill-border); backdrop-filter:blur(6px); overflow:hidden; white-space:nowrap; box-shadow:0 0 12px var(--pill-glow),inset 0 0 8px var(--pill-glow); }
        .ai-cyber-pill__scanlines { position:absolute; inset:0; background:repeating-linear-gradient(to bottom,transparent 0px,transparent 2px,rgba(0,0,0,0.22) 2px,rgba(0,0,0,0.22) 4px); pointer-events:none; z-index:1; animation:cyberScanMove 3s linear infinite; }
        .ai-cyber-pill__border-spin { position:absolute; inset:-80%; aspect-ratio:1/1; animation:cyberRotate 4s linear infinite; pointer-events:none; z-index:0; opacity:0.35; }
        .ai-cyber-pill__icon { position:relative; z-index:2; display:flex; align-items:center; flex-shrink:0; opacity:0.9; }
        .ai-cyber-pill__name { position:relative; z-index:2; font-family:var(--font-page-display),sans-serif; font-size:11px; letter-spacing:0.2em; line-height:1; opacity:0.85; text-shadow:-1px 0 rgba(102,224,255,0.3),1px 0 rgba(227,102,255,0.25); }
        .ai-cyber-pill--in      { opacity:0; animation:cyberPillIn   0.45s steps(4) forwards; }
        .ai-cyber-pill--visible { opacity:1; animation:cyberPillIdle 4s   steps(3) infinite; }
        .ai-cyber-pill--visible .ai-cyber-pill__name { animation:cyberPillTextIdle 4s steps(3) infinite; }
        .ai-cyber-pill--out     { animation:cyberPillOut  0.5s steps(4) forwards; }
        @keyframes cyberPillIn       { 0%{opacity:0;transform:translateX(-5px) skewX(-5deg)} 30%{opacity:0.7;transform:translateX(3px) skewX(2deg)} 60%{opacity:0.5;transform:translateX(-2px)} 80%{opacity:0.9;transform:translateX(1px) skewX(-1deg)} 100%{opacity:1;transform:translateX(0)} }
        @keyframes cyberPillIdle     { 0%,82%,100%{transform:translateX(0)} 84%{transform:translateX(-2px) skewX(-1.5deg)} 86%{transform:translateX(2px) skewX(1deg)} 88%{transform:translateX(0)} }
        @keyframes cyberPillTextIdle { 0%,82%,100%{opacity:0.85;text-shadow:-1px 0 rgba(102,224,255,0.3),1px 0 rgba(227,102,255,0.25)} 84%{opacity:1;text-shadow:-4px 0 rgba(102,224,255,0.6),4px 0 rgba(227,102,255,0.5)} 86%{opacity:0.6;text-shadow:3px 0 rgba(102,224,255,0.5),-3px 0 rgba(227,102,255,0.4)} 88%{opacity:0.85} }
        @keyframes cyberPillOut      { 0%{opacity:1;transform:translateX(0)} 25%{opacity:0.7;transform:translateX(3px) skewX(2deg)} 50%{opacity:0.4;transform:translateX(-3px)} 75%{opacity:0.15;transform:translateX(4px) skewX(-2deg)} 100%{opacity:0;transform:translateX(6px)} }

        /* ════ CYBER CARD ════ */
        .cyber-card-wrapper { filter:drop-shadow(18px 14px 14px rgba(64,144,181,0.18)) drop-shadow(-18px -14px 14px rgba(158,48,169,0.2)); animation:cyberBlinkShadow 8s ease-in infinite; width:100%; }
        .cyber-card-container { width:100%; }
        .cyber-card-content { position:relative; display:grid; grid-template-rows:auto 1fr auto; align-items:center; justify-items:center; padding:10px 10px 12px; background-color:hsl(296,59%,10%); width:100%; aspect-ratio:3/4; clip-path:polygon(0 0,82% 0,100% 12%,100% 58%,93% 63%,94% 76%,100% 79%,100% 91%,91% 100%,0 100%); overflow:hidden; }
        .cyber-rotate-border { content:""; position:absolute; width:260%; aspect-ratio:1/1; top:50%; left:50%; transform-origin:center; background:linear-gradient(to bottom,transparent,transparent,rgba(102,224,255,0.6),rgba(102,224,255,0.6),rgba(227,102,255,0.6),rgba(227,102,255,0.6),transparent,transparent),linear-gradient(to left,transparent,transparent,rgba(102,224,255,0.6),rgba(102,224,255,0.6),rgba(227,102,255,0.6),rgba(227,102,255,0.6),transparent,transparent); animation:cyberRotate 5s infinite linear; pointer-events:none; z-index:0; }
        .cyber-after-overlay { position:absolute; top:1%; left:1%; width:98%; height:98%; background:repeating-linear-gradient(to bottom,transparent 0%,rgba(64,144,181,0.5) 1px,rgb(0,0,0) 3px,rgba(64,144,181,0.28) 5px,#153544 4px,transparent 0.5%),repeating-linear-gradient(to left,hsl(295,60%,12%) 100%,hsla(295,60%,12%,0.99) 100%); box-shadow:inset 0px 0px 30px 40px hsl(296,59%,10%); clip-path:polygon(0 0,82% 0,100% 12%,100% 58%,93% 63%,94% 76%,100% 79%,100% 91%,91% 100%,0 100%); animation:cyberBackglitch 94ms linear infinite; pointer-events:none; z-index:2; }
        .cyber-card-title,
        .cyber-card-footer { position:relative; z-index:5; width:100%; display:flex; justify-content:center; align-items:center; padding:4px 0; }
        .cyber-title-text { font-family:var(--font-page-display),sans-serif; font-size:10px; letter-spacing:0.22em; color:hsl(192,100%,88%); position:relative; z-index:6; }
        .cyber-title-text--orbitron { font-family:var(--font-page-orbitron),sans-serif; font-weight:600; letter-spacing:0.12em; }
        .cyber-photo-wrap { position:relative; z-index:3; width:100%; min-height:220px; height:100%; overflow:hidden; display:block; border:1px solid rgba(167,139,250,0.12); }
        .cyber-photo { display:block; width:100%; height:100%; object-fit:cover; object-position:center center; transform:scale(1.03); filter:saturate(1) contrast(1.05) brightness(1.02); z-index:3; }
        .cyber-glitch-layer { position:absolute; inset:0; background-image:url('/profile.jpg'); background-size:cover; background-position:center top; mix-blend-mode:screen; opacity:0; pointer-events:none; z-index:4; }
        .cyber-glitch-r { filter:hue-rotate(285deg); animation:cyberPhotoGlitchR 5s steps(2) infinite; }
        .cyber-glitch-b { filter:hue-rotate(150deg); animation:cyberPhotoGlitchB 5s steps(2) infinite; }
        .cyber-photo-scanlines { position:absolute; inset:0; background:repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,0.28) 3px,rgba(0,0,0,0.28) 4px); pointer-events:none; z-index:6; }
        .cyber-photo-fade { position:absolute; inset:0; background:linear-gradient(to top,hsl(296,59%,10%) 0%,transparent 35%,transparent 70%,rgba(6,5,26,0.45) 100%); z-index:7; pointer-events:none; }
        @keyframes cyberRotate { to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes cyberBackglitch { 0%,100%{opacity:0.9} 50%{opacity:0.72} }
        @keyframes cyberBlinkShadow { 0%,100%{filter:drop-shadow(18px 14px 14px rgba(64,144,181,0.18)) drop-shadow(-18px -14px 14px rgba(158,48,169,0.2))} 50%{filter:drop-shadow(10px 8px 18px rgba(34,211,238,0.24)) drop-shadow(-10px -8px 18px rgba(167,139,250,0.28))} }
        @keyframes cyberPhotoGlitchR { 0%,88%,100%{opacity:0;transform:translateX(0)} 90%{opacity:0.22;transform:translateX(4px)} 92%{opacity:0;transform:translateX(0)} }
        @keyframes cyberPhotoGlitchB { 0%,84%,100%{opacity:0;transform:translateX(0)} 86%{opacity:0.18;transform:translateX(-4px)} 88%{opacity:0;transform:translateX(0)} }

        /* Buttons and forms */
        .tooltip-btn-wrap { position:relative; display:inline-flex; width:fit-content; }
        .uv-tooltip-btn { position:relative; display:inline-flex; align-items:center; gap:8px; padding:13px 24px; border-radius:10px; border:none; cursor:pointer; font-family:var(--font-page-display),sans-serif; font-size:15px; letter-spacing:0.14em; line-height:1; color:#fff; transition:all 0.3s cubic-bezier(0.68,-0.55,0.265,1.55); box-shadow:0 10px 20px rgba(0,0,0,0.25); overflow:visible; }
        .uv-tooltip-btn--purple { background:linear-gradient(135deg,#7c3aed,#a78bfa); box-shadow:0 0 18px rgba(124,58,237,0.45),0 10px 20px rgba(0,0,0,0.25); }
        .uv-tooltip-btn--cyan { background:linear-gradient(135deg,#0e7490,#22d3ee); box-shadow:0 0 18px rgba(34,211,238,0.35),0 10px 20px rgba(0,0,0,0.25); }
        .uv-tooltip-btn--gradient { background:linear-gradient(120deg,#7c3aed 0%,#a78bfa 35%,#22d3ee 70%,#7c3aed 100%); background-size:220% 220%; box-shadow:0 0 22px rgba(124,58,237,0.45),0 0 22px rgba(34,211,238,0.2),0 10px 20px rgba(0,0,0,0.3); animation:gradientBtnShift 5s ease infinite; }
        .uv-tooltip-btn--gradient:hover { background-position:100% 50%; box-shadow:0 0 30px rgba(124,58,237,0.55),0 0 30px rgba(34,211,238,0.3),0 10px 24px rgba(0,0,0,0.35); }
        .uv-tooltip-btn.uv-sending { opacity:0.7; cursor:not-allowed; animation-play-state:paused; }
        .uv-tooltip-btn:disabled { transform:none; }
        @keyframes gradientBtnShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        .uv-tooltip-label { display:inline-flex; align-items:center; gap:8px; position:relative; z-index:2; }
        .uv-tooltip { position:absolute; top:0; left:50%; transform:translate(-50%,-120%); font-size:11px; font-family:'Barlow',sans-serif; font-weight:700; letter-spacing:0.1em; background:rgba(11,10,26,0.95); color:#a78bfa; padding:6px 12px; border-radius:8px; border:1px solid rgba(167,139,250,0.35); box-shadow:0 8px 20px rgba(0,0,0,0.3); opacity:0; pointer-events:none; white-space:nowrap; transition:all 0.25s ease; backdrop-filter:blur(8px); }
        .uv-tooltip--cyan { color:#22d3ee; border-color:rgba(34,211,238,0.35); }
        .uv-tooltip--gradient { color:#c4b5fd; border-color:rgba(167,139,250,0.4); }
        .uv-tooltip-btn:hover .uv-tooltip { opacity:1; transform:translate(-50%,-145%); }
        .uv-tooltip-btn:not(:disabled):hover { transform:translateY(-2px); }
        .hero-btn { position:relative; display:inline-flex; align-items:center; justify-content:center; padding:10px 20px; border-radius:999px; font-family:var(--font-page-display),sans-serif; font-size:13px; font-weight:400; letter-spacing:0.16em; text-transform:uppercase; text-decoration:none; transition:all 0.25s ease; white-space:nowrap; }
        .hero-btn--ghost { color:#c4b5fd; border:1px solid rgba(167,139,250,0.45); background:rgba(11,10,26,0.25); box-shadow:inset 0 0 0 1px rgba(255,255,255,0.02); }
        .hero-btn--ghost:hover { transform:translateY(-2px); border-color:rgba(167,139,250,0.8); background:rgba(167,139,250,0.1); box-shadow:0 0 14px rgba(124,58,237,0.2); color:#f0eeff; }
        .hero-btn--solid { color:#f8f7ff; background:linear-gradient(135deg,#7c3aed 0%,#a78bfa 45%,#22d3ee 100%); box-shadow:0 0 20px rgba(124,58,237,0.3),0 0 18px rgba(34,211,238,0.16); }
        .hero-btn--solid:hover { transform:translateY(-2px); box-shadow:0 0 24px rgba(124,58,237,0.4),0 0 22px rgba(34,211,238,0.24); }
        .btn-glitch { position:relative; display:inline-block; padding:2px; font-family:var(--font-page-display),sans-serif; font-size:14px; letter-spacing:0.15em; text-decoration:none; border-radius:50px; overflow:hidden; isolation:isolate; border:none; animation:btnIdleShake 4s steps(3) infinite; }
        .btn-glitch-ghost { background:linear-gradient(120deg,#7c3aed,#a78bfa,#22d3ee,#7c3aed); background-size:300% 300%; animation:btnIdleShake 4s steps(3) infinite, ghostBorderShift 6s linear infinite; box-shadow:0 0 16px rgba(124,58,237,0.3),0 0 16px rgba(34,211,238,0.15); }
        @keyframes ghostBorderShift { 0%{background-position:0% 50%} 100%{background-position:300% 50%} }
        .btn-glitch-inner { position:relative; z-index:2; display:flex; align-items:center; justify-content:center; border-radius:50px; padding:7px 22px; font-family:var(--font-page-display),sans-serif; font-size:14px; letter-spacing:0.15em; white-space:nowrap; background:rgba(11,10,26,0.94); color:#c4b5fd; border:1px solid rgba(167,139,250,0.15); transition:color 0.25s ease; }
        .btn-glitch-ghost:hover .btn-glitch-inner { color:#f0eeff; background:rgba(11,10,26,0.8); }
        .btn-glitch-chroma { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; border-radius:50px; font-family:var(--font-page-display),sans-serif; font-size:14px; letter-spacing:0.15em; pointer-events:none; z-index:3; color:#66e0ff; mix-blend-mode:screen; opacity:0; animation:btnIdleChromatic 4s steps(3) infinite; }
        .btn-glitch-flash { position:absolute; inset:0; border-radius:50px; background:#fff; opacity:0; pointer-events:none; z-index:4; animation:btnIdleFlash 4s steps(3) infinite; }
        @keyframes btnIdleShake { 0%,90%,100%{transform:translateX(0)} 92%{transform:translateX(-1px)} 94%{transform:translateX(1px)} }
        @keyframes btnIdleChromatic { 0%,90%,100%{opacity:0} 92%{opacity:0.35} 94%{opacity:0.15} }
        @keyframes btnIdleFlash { 0%,94%,100%{opacity:0} 95%{opacity:0.08} }
        .hire-field-wrap { display:flex; flex-direction:column; gap:6px; }
        .hire-label { font-size:9px; font-family:'Barlow',sans-serif; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:#4c3d7a; }
        .hire-input { background:rgba(5,4,18,0.7); border:1px solid rgba(139,92,246,0.18); border-radius:8px; padding:10px 12px; color:#e2e8f0; font-family:'Barlow',sans-serif; font-size:12px; outline:none; transition:border-color 0.2s,box-shadow 0.2s; width:100%; }
        .hire-input:focus { border-color:rgba(167,139,250,0.55); box-shadow:0 0 0 3px rgba(167,139,250,0.08); }
        .hire-select { appearance:none; }
        .hire-textarea { resize:vertical; min-height:110px; }

        @media (max-width: 980px) {
          nav { position:fixed !important; background:rgba(11,10,26,0.78); backdrop-filter:blur(12px); }
          nav > div:last-child { gap:1rem !important; }
          section:first-of-type { min-height:auto !important; padding-top:90px !important; }
          section:first-of-type > div:nth-of-type(2) { grid-template-columns:1fr !important; }
          .hero-left { padding-right:0 !important; padding-top:40px !important; }
        }
        @media (max-width: 720px) {
          nav > div:last-child { display:none !important; }
          .hero-stats { gap:1rem !important; }
          #contact .reveal { overflow-wrap:anywhere; }
        }
      `}</style>
    </>
  );
}