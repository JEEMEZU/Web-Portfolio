'use client';

import { useEffect, useState } from 'react';
import { Barlow, League_Spartan } from 'next/font/google';

const leagueSpartan = League_Spartan({
  weight: 'variable',
  subsets: ['latin'],
  variable: '--font-loading-display',
});

const barlow = Barlow({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-loading-sans',
});

export default function LoadingScreen({ onComplete }: { onComplete?: () => void }) {
  const [phase, setPhase] = useState<'loader' | 'intro' | 'done'>('loader');
  const [progress, setProgress] = useState(0);
  const [logoVisible, setLogoVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [barVisible, setBarVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('intro'), 1700);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== 'intro') return;

    const t1 = setTimeout(() => setLogoVisible(true), 120);
    const t2 = setTimeout(() => setTextVisible(true), 780);
    const t3 = setTimeout(() => setTaglineVisible(true), 1100);
    const t4 = setTimeout(() => setBarVisible(true), 1320);

    let prog = 0;
    const startFill = setTimeout(() => {
      const interval = setInterval(() => {
        prog += Math.random() * 10 + 3;
        if (prog >= 100) {
          prog = 100;
          clearInterval(interval);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => { setPhase('done'); onComplete?.(); }, 800);
          }, 400);
        }
        setProgress(Math.min(prog, 100));
      }, 90);
    }, 1400);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      clearTimeout(t4); clearTimeout(startFill);
    };
  }, [phase, onComplete]);

  if (phase === 'done') return null;

  return (
    <>
      <div className={`${leagueSpartan.variable} ${barlow.variable} ls-root${fadeOut ? ' ls-out' : ''}`}>
        {/* Background layers */}
        <div className="ls-bg-grid" />
        <div className="ls-bg-vignette" />
        <div className="ls-orb ls-orb-tl" />
        <div className="ls-orb ls-orb-br" />
        <div className="ls-particles">
          {[...Array(18)].map((_, i) => (
            <div key={i} className={`ls-particle ls-particle-${i + 1}`} />
          ))}
        </div>

        {/* Phase 1 — triangle spinner */}
        {phase === 'loader' && (
          <div className="ls-phase ls-phase-loader">
            <div className="ls-tri-loader" />
            <div className="ls-init-text">
              <span className="ls-init-char">I</span>
              <span className="ls-init-char">N</span>
              <span className="ls-init-char">I</span>
              <span className="ls-init-char">T</span>
              <span className="ls-init-char">I</span>
              <span className="ls-init-char">A</span>
              <span className="ls-init-char">L</span>
              <span className="ls-init-char">I</span>
              <span className="ls-init-char">Z</span>
              <span className="ls-init-char">I</span>
              <span className="ls-init-char">N</span>
              <span className="ls-init-char">G</span>
            </div>
          </div>
        )}

        {/* Phase 2 — cinematic intro */}
        {phase === 'intro' && (
          <div className="ls-phase ls-phase-intro">

            {/* ── LOGO ── */}
            <div className={`ls-logo-wrap${logoVisible ? ' ls-logo-wrap--in' : ''}`}>
              {/* outer slow spin ring */}
              <div className="ls-logo-orbit ls-logo-orbit--slow" />
              {/* inner fast spin ring */}
              <div className="ls-logo-orbit ls-logo-orbit--fast" />
              {/* corner accents */}
              <div className="ls-corner ls-corner-tl" />
              <div className="ls-corner ls-corner-tr" />
              <div className="ls-corner ls-corner-bl" />
              <div className="ls-corner ls-corner-br" />
              {/* conic spin border */}
              <div className="ls-logo-border" />
              {/* photo */}
              <img src="/logo.jpg" alt="Logo" className="ls-logo-photo" />
              {/* pulse rings */}
              <div className="ls-pulse ls-pulse-1" />
              <div className="ls-pulse ls-pulse-2" />
              <div className="ls-pulse ls-pulse-3" />
            </div>

            {/* ── NAME TEXT ── */}
            <div className={`ls-name-wrap${textVisible ? ' ls-name-wrap--in' : ''}`}>
              {/* each letter slides in individually */}
              {'PORTFOLIO'.split('').map((ch, i) => (
                <span key={i} className="ls-letter ls-letter-portfolio" style={{ '--i': i } as React.CSSProperties}>{ch}</span>
              ))}
            </div>

            {/* ── TAGLINE ── */}
            <div className={`ls-tagline-wrap${taglineVisible ? ' ls-tagline-wrap--in' : ''}`}>
              <div className="ls-tl-line ls-tl-line-l" />
              <span className="ls-tagline-text">IT Student · Developer · Philippines</span>
              <div className="ls-tl-line ls-tl-line-r" />
            </div>

            {/* ── PROGRESS ── */}
            <div className={`ls-bar-wrap${barVisible ? ' ls-bar-wrap--in' : ''}`}>
              <div className="ls-bar-meta">
                <span className="ls-bar-label-l">Loading experience</span>
                <span className="ls-bar-label-r">{Math.round(progress)}%</span>
              </div>
              <div className="ls-bar-track">
                <div className="ls-bar-fill" style={{ width: `${progress}%` }} />
                <div className="ls-bar-head" style={{ left: `${progress}%` }} />
                {/* tick marks */}
                {[25, 50, 75].map(t => (
                  <div key={t} className={`ls-tick${progress >= t ? ' ls-tick--lit' : ''}`} style={{ left: `${t}%` }} />
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      <style>{`
        /* ════ ROOT ════ */
        .ls-root {
          position: fixed; inset: 0; z-index: 9999;
          background: #06051a;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          transition: opacity 0.85s cubic-bezier(0.4,0,0.2,1), transform 0.85s cubic-bezier(0.4,0,0.2,1);
        }
        .ls-out { opacity: 0; transform: scale(1.04); pointer-events: none; }

        /* ════ BACKGROUND ════ */
        .ls-bg-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(167,139,250,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(167,139,250,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
        }
        .ls-bg-vignette {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(6,5,26,0.95) 100%);
        }
        .ls-orb {
          position: absolute; border-radius: 50%; pointer-events: none; filter: blur(2px);
        }
        .ls-orb-tl {
          width: 600px; height: 600px; top: -20%; left: -15%;
          background: radial-gradient(ellipse, rgba(109,40,217,0.14) 0%, transparent 65%);
          animation: ls-orb-drift 12s ease-in-out infinite alternate;
        }
        .ls-orb-br {
          width: 500px; height: 500px; bottom: -20%; right: -10%;
          background: radial-gradient(ellipse, rgba(34,211,238,0.08) 0%, transparent 65%);
          animation: ls-orb-drift 15s ease-in-out infinite alternate-reverse;
        }
        @keyframes ls-orb-drift {
          0% { transform: translate(0,0) scale(1); }
          100% { transform: translate(40px, 30px) scale(1.1); }
        }

        /* ════ PARTICLES ════ */
        .ls-particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .ls-particle {
          position: absolute; border-radius: 50%;
          background: rgba(167,139,250,0.5);
          animation: ls-particle-float linear infinite;
        }
        ${[...Array(18)].map((_, i) => {
          const size = (Math.sin(i * 7.3) * 0.7 + 1.2).toFixed(1);
          const left = ((i * 37 + 11) % 97).toFixed(0);
          const dur = (8 + (i * 3.7) % 12).toFixed(1);
          const delay = ((i * 1.9) % 10).toFixed(1);
          const opacity = (0.2 + (i % 5) * 0.07).toFixed(2);
          return `.ls-particle-${i+1}{width:${size}px;height:${size}px;left:${left}%;bottom:-10px;opacity:${opacity};animation-duration:${dur}s;animation-delay:-${delay}s;}`;
        }).join('\n')}
        @keyframes ls-particle-float {
          0%   { transform: translateY(0) translateX(0);   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.8; }
          100% { transform: translateY(-110vh) translateX(30px); opacity: 0; }
        }

        /* ════ PHASES ════ */
        .ls-phase {
          display: flex; flex-direction: column; align-items: center;
          position: absolute;
        }
        .ls-phase-loader { gap: 16px; }
        .ls-phase-intro  { gap: 16px; }

        /* ════ TRIANGLE LOADER ════ */
        .ls-tri-loader {
          width: 60px; aspect-ratio: 1.154; position: relative;
          background: conic-gradient(from 120deg at 50% 64%, #0000, #a78bfa 1deg 120deg, #0000 121deg);
          animation: tri0 1.5s infinite cubic-bezier(0.3,1,0,1);
          filter: drop-shadow(0 0 16px rgba(167,139,250,0.7));
        }
        .ls-tri-loader:before, .ls-tri-loader:after {
          content:""; position:absolute; inset:0;
          background:inherit; transform-origin:50% 66%;
          animation:tri1 1.5s infinite;
        }
        .ls-tri-loader:after { --s:-1; }
        @keyframes tri0 {
          0%,30%{transform:rotate(0)}
          70%{transform:rotate(120deg)}
          70.01%,100%{transform:rotate(360deg)}
        }
        @keyframes tri1 {
          0%{transform:rotate(calc(var(--s,1)*120deg)) translate(0)}
          30%,70%{transform:rotate(calc(var(--s,1)*120deg)) translate(calc(var(--s,1)*-5px),10px)}
          100%{transform:rotate(calc(var(--s,1)*120deg)) translate(0)}
        }

        /* Initializing text */
        .ls-init-text {
          display: flex; gap: 3px;
        }
        .ls-init-char {
          font-family: var(--font-loading-display), sans-serif; font-size:12px;
          letter-spacing:0.18em; color:#4c3d7a;
          animation: ls-char-blink 1.4s ease-in-out infinite;
        }
        .ls-init-char:nth-child(1){animation-delay:0s}
        .ls-init-char:nth-child(2){animation-delay:0.08s}
        .ls-init-char:nth-child(3){animation-delay:0.16s}
        .ls-init-char:nth-child(4){animation-delay:0.24s}
        .ls-init-char:nth-child(5){animation-delay:0.32s}
        .ls-init-char:nth-child(6){animation-delay:0.4s}
        .ls-init-char:nth-child(7){animation-delay:0.48s}
        .ls-init-char:nth-child(8){animation-delay:0.56s}
        .ls-init-char:nth-child(9){animation-delay:0.64s}
        .ls-init-char:nth-child(10){animation-delay:0.72s}
        .ls-init-char:nth-child(11){animation-delay:0.8s}
        .ls-init-char:nth-child(12){animation-delay:0.88s}
        @keyframes ls-char-blink {
          0%,100%{opacity:0.25;transform:translateY(0)}
          50%{opacity:1;transform:translateY(-2px)}
        }

        /* ════ LOGO ════ */
        .ls-logo-wrap {
          position: relative;
          width: 55px; height: 55px;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transform: scale(0.3) rotate(-15deg);
          transition:
            opacity 0.7s cubic-bezier(0.34,1.56,0.64,1),
            transform 0.7s cubic-bezier(0.34,1.56,0.64,1);
        }
        .ls-logo-wrap--in {
          opacity: 1; transform: scale(1) rotate(0deg);
        }

        /* orbit rings */
        .ls-logo-orbit {
          position: absolute; border-radius: 50%; pointer-events: none;
        }
        .ls-logo-orbit--slow {
          inset: -16px;
          border: 1px dashed rgba(167,139,250,0.25);
          animation: ls-orbit-cw 8s linear infinite;
        }
        .ls-logo-orbit--fast {
          inset: -28px;
          border: 1px dashed rgba(34,211,238,0.15);
          animation: ls-orbit-ccw 5s linear infinite;
        }
        @keyframes ls-orbit-cw  { to { transform: rotate(360deg); } }
        @keyframes ls-orbit-ccw { to { transform: rotate(-360deg); } }

        /* corner accents (L-brackets) */
        .ls-corner {
          position: absolute; width: 14px; height: 14px; pointer-events: none;
        }
        .ls-corner-tl { top: -8px; left: -8px;  border-top: 2px solid #a78bfa; border-left: 2px solid #a78bfa; }
        .ls-corner-tr { top: -8px; right: -8px; border-top: 2px solid #a78bfa; border-right: 2px solid #a78bfa; }
        .ls-corner-bl { bottom: -8px; left: -8px;  border-bottom: 2px solid #22d3ee; border-left: 2px solid #22d3ee; }
        .ls-corner-br { bottom: -8px; right: -8px; border-bottom: 2px solid #22d3ee; border-right: 2px solid #22d3ee; }
        .ls-logo-wrap--in .ls-corner {
          animation: ls-corner-pulse 3s ease-in-out infinite;
        }
        @keyframes ls-corner-pulse {
          0%,100%{ opacity:0.6; } 50%{ opacity:1; box-shadow:0 0 8px rgba(167,139,250,0.5); }
        }

        /* spinning conic border */
        .ls-logo-border {
          position: absolute; inset: -4px; border-radius: 50%;
          background: conic-gradient(from 0deg, transparent 0deg, #7c3aed 60deg, #a78bfa 120deg, #22d3ee 180deg, transparent 240deg, transparent 360deg);
          animation: ls-orbit-cw 2.5s linear infinite;
          z-index: 0;
        }
        .ls-logo-border::after {
          content:''; position:absolute; inset:4px;
          border-radius:50%; background:#06051a;
        }

        /* photo */
        .ls-logo-photo {
          width: 48px; height: 48px;
          border-radius: 50%; object-fit: cover;
          position: relative; z-index: 2;
          border: 2px solid rgba(109,40,217,0.6);
          box-shadow: 0 0 24px rgba(109,40,217,0.3), inset 0 0 12px rgba(167,139,250,0.1);
          transition: box-shadow 0.3s ease;
        }
        .ls-logo-wrap--in .ls-logo-photo {
          animation: ls-photo-glow 3s ease-in-out infinite alternate;
        }
        @keyframes ls-photo-glow {
          0%  { box-shadow: 0 0 20px rgba(109,40,217,0.3), 0 0 40px rgba(167,139,250,0.1); }
          100%{ box-shadow: 0 0 32px rgba(109,40,217,0.5), 0 0 64px rgba(167,139,250,0.2); }
        }

        /* pulse rings */
        .ls-pulse {
          position: absolute; border-radius: 50%; pointer-events: none;
          border: 1px solid rgba(167,139,250,0.4);
        }
        .ls-logo-wrap--in .ls-pulse-1 { inset:-10px; animation: ls-pulse-go 2.4s ease-out infinite 0s; }
        .ls-logo-wrap--in .ls-pulse-2 { inset:-10px; animation: ls-pulse-go 2.4s ease-out infinite 0.8s; }
        .ls-logo-wrap--in .ls-pulse-3 { inset:-10px; animation: ls-pulse-go 2.4s ease-out infinite 1.6s; }
        @keyframes ls-pulse-go {
          0%  { transform:scale(1);   opacity:0.7; border-color:rgba(167,139,250,0.5); }
          100%{ transform:scale(2.6); opacity:0;   border-color:rgba(167,139,250,0);   }
        }

        /* ════ NAME TEXT ════ */
        .ls-name-wrap {
          position: relative;
          display: flex; align-items: baseline;
          gap: 0; overflow: hidden;
          padding: 4px 8px;
        }
        .ls-letter {
          font-family: var(--font-loading-display), sans-serif;
          font-size: clamp(14px, 2.5vw, 24px);
          font-weight: 800;
          line-height: 0.9;
          letter-spacing: 0;
          text-transform: uppercase;
          display: inline-block;
          opacity: 0;
          transform: translateY(60px) rotateX(-90deg);
          transform-origin: bottom center;
          transition: none;
        }

        /* PORTFOLIO letters — cyan accent */
        .ls-letter-portfolio {
          background: linear-gradient(135deg, #f0eeff 0%, #c4b5fd 38%, #a78bfa 68%, #22d3ee 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 18px rgba(167,139,250,0.36));
        }

        /* When wrapper gets --in class, trigger each letter */
        .ls-name-wrap--in .ls-letter {
          animation: ls-letter-in 0.55s cubic-bezier(0.34,1.4,0.64,1) forwards;
        }
        /* PORTFOLIO letters stagger in one by one */
        .ls-name-wrap--in .ls-letter-portfolio {
          animation-delay: calc(var(--i) * 0.055s);
        }
        @keyframes ls-letter-in {
          0%   { opacity:0; transform:translateY(60px) rotateX(-90deg); }
          60%  { opacity:1; }
          100% { opacity:1; transform:translateY(0) rotateX(0deg); }
        }
        .ls-name-wrap--in .ls-letter-portfolio {
          animation-name: ls-letter-in, ls-name-glow;
          animation-duration: 0.55s, 3s;
          animation-timing-function: cubic-bezier(0.34,1.4,0.64,1), linear;
          animation-fill-mode: forwards, none;
          animation-iteration-count: 1, infinite;
        }
        @keyframes ls-name-glow {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        /* ════ TAGLINE ════ */
        .ls-tagline-wrap {
          display: flex; align-items: center; gap: 10px;
          opacity: 0; transform: translateY(10px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .ls-tagline-wrap--in { opacity:1; transform:translateY(0); }
        .ls-tagline-text {
          font-family: var(--font-loading-sans), sans-serif;
          font-size: 8px; font-weight: 700;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: #5a4e80;
          white-space: nowrap;
        }
        .ls-tl-line {
          height: 1px; background: linear-gradient(90deg, transparent, rgba(167,139,250,0.35));
          flex: 1; min-width: 28px;
          transform: scaleX(0); transform-origin: right;
          transition: transform 0.6s cubic-bezier(0.4,0,0.2,1) 0.1s;
        }
        .ls-tl-line-l { transform-origin: right; }
        .ls-tl-line-r { transform-origin: left; background: linear-gradient(90deg, rgba(167,139,250,0.35), transparent); }
        .ls-tagline-wrap--in .ls-tl-line { transform: scaleX(1); }

        /* ════ PROGRESS BAR ════ */
        .ls-bar-wrap {
          width: min(200px, 50vw);
          display: flex; flex-direction: column; gap: 8px;
          opacity: 0; transform: translateY(12px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .ls-bar-wrap--in { opacity:1; transform:translateY(0); }

        .ls-bar-meta {
          display: flex; justify-content: space-between; align-items: center;
        }
        .ls-bar-label-l {
          font-family: var(--font-loading-sans), sans-serif; font-size: 9px; font-weight: 600;
          letter-spacing: 0.2em; text-transform: uppercase; color: #3d3066;
        }
        .ls-bar-label-r {
          font-family: var(--font-loading-display), sans-serif; font-size: 13px;
          letter-spacing: 0.2em; color: #a78bfa;
          text-shadow: 0 0 10px rgba(167,139,250,0.5);
        }

        .ls-bar-track {
          position: relative; height: 3px;
          background: rgba(139,92,246,0.12); border-radius: 3px;
          overflow: visible;
        }
        .ls-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #7c3aed, #a78bfa 60%, #22d3ee);
          border-radius: 3px;
          transition: width 0.1s linear;
          position: relative;
          box-shadow: 0 0 10px rgba(167,139,250,0.6), 0 0 20px rgba(124,58,237,0.3);
        }

        /* glowing head dot */
        .ls-bar-head {
          position: absolute; top: 50%;
          transform: translate(-50%, -50%);
          width: 10px; height: 10px; border-radius: 50%;
          background: #e9d5ff;
          box-shadow: 0 0 0 3px rgba(167,139,250,0.25), 0 0 14px 4px rgba(167,139,250,0.7), 0 0 28px 8px rgba(124,58,237,0.35);
          transition: left 0.1s linear;
          pointer-events: none;
        }

        /* tick marks */
        .ls-tick {
          position: absolute; top: 50%; transform: translate(-50%, -50%);
          width: 1px; height: 9px;
          background: rgba(139,92,246,0.2);
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }
        .ls-tick--lit {
          background: rgba(167,139,250,0.6);
          box-shadow: 0 0 6px rgba(167,139,250,0.4);
        }
      `}</style>
    </>
  );
}
