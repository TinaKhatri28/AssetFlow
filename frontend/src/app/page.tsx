"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * AssetFlow marketing landing page.
 *
 * Drop this into your Next.js app (e.g. app/page.tsx or
 * features/marketing/AssetFlowLanding.tsx) and render <AssetFlowLanding />.
 *
 * Fonts: this component pulls Archivo Black / Inter / JetBrains Mono via an
 * @import inside the embedded <style> tag so it works out of the box. For a
 * production build, prefer wiring these up with next/font in your root
 * layout instead and removing the @import line below.
 */

type Counter = {
    label: string;
    target: number;
    dark?: boolean;
};

const COUNTERS: Counter[] = [
    { label: "Total assets", target: 1284 },
    { label: "Allocated", target: 962, dark: true },
    { label: "Maintenance today", target: 7 },
    { label: "Active bookings", target: 23 },
];

const TICKER_ITEMS: { text: string; bold: string }[] = [
    { text: "allocated to J. Mehta — IT Dept", bold: "AF-0231" },
    { text: "booked 14:00–15:30", bold: "Conference Hall B" },
    { text: "flagged for maintenance — screen damage", bold: "AF-0087" },
    { text: "transfer approved by D. Rao", bold: "AF-0119" },
    { text: "audit cycle started — 214 items", bold: "Q3-WAREHOUSE" },
];

function AnimatedCounter({ target }: { target: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated.current) {
                        hasAnimated.current = true;
                        const duration = 1200;
                        const start = performance.now();

                        const step = (now: number) => {
                            const progress = Math.min((now - start) / duration, 1);
                            setCount(Math.floor(progress * target));
                            if (progress < 1) requestAnimationFrame(step);
                        };

                        requestAnimationFrame(step);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.4 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [target]);

    return (
        <div ref={ref} className="num">
            {count.toLocaleString()}
        </div>
    );
}

export default function AssetFlowLanding() {
    const dotDelays = useMemo(
        () => [Math.random() * 3, Math.random() * 3, Math.random() * 3],
        []
    );

    return (
        <div className="af-root">
            <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

        .af-root {
          --black:#111110;
          --white:#FAFAF6;
          --paper:#F2F1E9;
          --yellow:#FFD400;
          --gray:#726f66;
          --radius:2px;
          background: var(--white);
          color: var(--black);
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }
        .af-root, .af-root * { box-sizing: border-box; }
        .af-root a { color: inherit; text-decoration: none; }
        .af-root h1, .af-root h2, .af-root h3 {
          font-family: 'Archivo Black', sans-serif;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          line-height: 0.98;
          margin: 0;
        }
        .af-root .mono { font-family: 'JetBrains Mono', monospace; }
        .af-root .wrap { max-width: 1180px; margin: 0 auto; padding: 0 32px; }

        .af-root .stripe-thin {
          height: 10px; width: 100%;
          background-image: repeating-linear-gradient(-45deg, var(--yellow) 0 18px, var(--black) 18px 36px);
        }

        .af-root header {
          position: sticky; top: 0; z-index: 50;
          background: var(--white);
          border-bottom: 3px solid var(--black);
        }
        .af-root nav { display: flex; align-items: center; justify-content: space-between; padding: 18px 0; }
        .af-root .logo { display: flex; align-items: center; gap: 10px; font-family: 'Archivo Black'; font-size: 20px; }
        .af-root .logo .tag {
          background: var(--black); color: var(--yellow);
          font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700;
          padding: 3px 6px; border-radius: 2px; letter-spacing: 0.04em;
        }
        .af-root .navlinks { display: flex; gap: 32px; font-size: 14px; font-weight: 600; }
        .af-root .navlinks a { position: relative; padding: 4px 0; }
        .af-root .navlinks a:hover { color: var(--gray); }
        @media (max-width: 760px) { .af-root .navlinks { display: none; } }

        .af-root .btn3d {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'Inter'; font-weight: 800; font-size: 14px;
          text-transform: uppercase; letter-spacing: 0.03em;
          background: var(--yellow); color: var(--black);
          border: 3px solid var(--black); padding: 14px 26px;
          border-radius: var(--radius); box-shadow: 6px 6px 0 var(--black);
          cursor: pointer; transition: transform .12s ease, box-shadow .12s ease;
        }
        .af-root .btn3d:hover { transform: translate(-2px,-2px); box-shadow: 8px 8px 0 var(--black); }
        .af-root .btn3d:active { transform: translate(4px,4px); box-shadow: 1px 1px 0 var(--black); }
        .af-root .btn3d.ghost { background: var(--white); }
        .af-root .btn3d.small { padding: 10px 18px; font-size: 12px; box-shadow: 4px 4px 0 var(--black); }
        .af-root .btn3d.small:hover { transform: translate(-1px,-1px); box-shadow: 5px 5px 0 var(--black); }

        .af-root .hero {
          position: relative; padding: 96px 0 70px;
          background: var(--white); overflow: hidden;
        }
        .af-root .hero-grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(var(--black) 1px, transparent 1px),
            linear-gradient(90deg, var(--black) 1px, transparent 1px);
          background-size: 42px 42px;
          opacity: 0.06;
          animation: af-driftGrid 14s linear infinite;
        }
        @keyframes af-driftGrid {
          from { background-position: 0 0, 0 0; }
          to { background-position: 42px 42px, 42px 42px; }
        }
        .af-root .hero-dot {
          position: absolute; width: 8px; height: 8px; background: var(--yellow);
          border: 2px solid var(--black); border-radius: 50%;
          animation: af-blipMove linear infinite;
        }
        @keyframes af-blipMove {
          0% { transform: translate(0,0); }
          50% { transform: translate(30px,-18px); }
          100% { transform: translate(0,0); }
        }
        .af-root .hero-inner {
          position: relative; z-index: 2; display: grid;
          grid-template-columns: 1.15fr 0.85fr; gap: 40px; align-items: center;
        }
        @media (max-width: 900px) { .af-root .hero-inner { grid-template-columns: 1fr; } }
        .af-root .eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'JetBrains Mono'; font-size: 12px; font-weight: 700;
          background: var(--black); color: var(--yellow);
          padding: 6px 10px; border-radius: 2px; margin-bottom: 22px;
        }
        .af-root .eyebrow .live-dot { width: 7px; height: 7px; background: var(--yellow); border-radius: 50%; animation: af-pulse 1.4s infinite; }
        @keyframes af-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
        .af-root .hero h1 { font-size: clamp(38px, 5.4vw, 66px); }
        .af-root .hero h1 .hl { background: var(--yellow); padding: 0 8px; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
        .af-root .hero p.sub { margin-top: 22px; font-size: 17px; color: var(--gray); max-width: 480px; line-height: 1.6; }
        .af-root .hero-ctas { margin-top: 34px; display: flex; gap: 16px; flex-wrap: wrap; }

        .af-root .tag-card {
          background: var(--black); color: var(--white);
          border: 3px solid var(--black); border-radius: 6px; padding: 24px;
          position: relative; box-shadow: 10px 10px 0 var(--yellow);
          font-family: 'JetBrains Mono';
        }
        .af-root .tag-card::before {
          content: ""; position: absolute; top: 16px; left: -11px; width: 20px; height: 20px;
          background: var(--white); border: 3px solid var(--black); border-radius: 50%;
        }
        .af-root .tag-row { display: flex; justify-content: space-between; font-size: 11px; color: #b7b5a9; margin-bottom: 4px; }
        .af-root .tag-code { font-size: 26px; color: var(--yellow); font-weight: 700; margin: 6px 0 14px; }
        .af-root .tag-status {
          display: inline-flex; align-items: center; gap: 6px; font-size: 11px;
          background: var(--yellow); color: var(--black); padding: 4px 8px; border-radius: 2px; font-weight: 700;
        }
        .af-root .tag-status .d { width: 6px; height: 6px; background: var(--black); border-radius: 50%; animation: af-pulse 1.2s infinite; }
        .af-root .tag-meta { margin-top: 16px; font-size: 12px; color: #cfcdc2; line-height: 1.9; }
        .af-root .tag-meta b { color: var(--white); }

        .af-root .ticker-wrap {
          background: var(--black); border-bottom: 3px solid var(--black);
          overflow: hidden; white-space: nowrap; padding: 12px 0;
        }
        .af-root .ticker-label {
          display: inline-block; vertical-align: middle; font-family: 'JetBrains Mono';
          font-size: 11px; font-weight: 700; color: var(--black); background: var(--yellow);
          padding: 4px 10px; margin-right: 18px; border-radius: 2px;
        }
        .af-root .ticker-track { display: inline-block; animation: af-scrollTicker 32s linear infinite; }
        .af-root .ticker-track span { font-family: 'JetBrains Mono'; font-size: 13px; color: var(--white); margin-right: 46px; }
        .af-root .ticker-track span b { color: var(--yellow); }
        @keyframes af-scrollTicker { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        .af-root section { padding: 88px 0; border-bottom: 3px solid var(--black); }
        .af-root .section-head { max-width: 640px; margin-bottom: 52px; }
        .af-root .kicker {
          font-family: 'JetBrains Mono'; font-size: 12px; font-weight: 700; letter-spacing: 0.05em;
          color: var(--black); display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
        }
        .af-root .kicker::before { content: ""; width: 24px; height: 3px; background: var(--yellow); }
        .af-root section h2 { font-size: clamp(28px, 3.6vw, 42px); }
        .af-root section p.lead { color: var(--gray); margin-top: 16px; font-size: 16px; max-width: 520px; line-height: 1.6; }

        .af-root .problem-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 2px; background: var(--black); border: 2px solid var(--black); }
        @media (max-width: 900px) { .af-root .problem-grid { grid-template-columns: repeat(2,1fr); } }
        .af-root .problem-card { background: var(--white); padding: 26px 22px; min-height: 170px; position: relative; }
        .af-root .problem-card .num { font-family: 'JetBrains Mono'; font-size: 12px; color: var(--gray); }
        .af-root .problem-card h3 { font-family: 'Inter'; font-weight: 800; font-size: 16px; text-transform: none; margin: 14px 0 8px; }
        .af-root .problem-card p { font-size: 13px; color: var(--gray); line-height: 1.55; margin: 0; }
        .af-root .problem-card::after {
          content: ""; position: absolute; bottom: 0; left: 0; height: 5px; width: 100%;
          background-image: repeating-linear-gradient(-45deg, var(--yellow) 0 8px, var(--black) 8px 16px);
          opacity: 0; transition: opacity .2s;
        }
        .af-root .problem-card:hover::after { opacity: 1; }

        .af-root .module-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        @media (max-width: 900px) { .af-root .module-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 600px) { .af-root .module-grid { grid-template-columns: 1fr; } }
        .af-root .module {
          border: 3px solid var(--black); border-radius: 6px; padding: 22px; background: var(--paper);
          box-shadow: 6px 6px 0 var(--black); transition: transform .15s, box-shadow .15s;
        }
        .af-root .module:hover { transform: translate(-3px,-3px); box-shadow: 9px 9px 0 var(--black); }
        .af-root .module .code { font-family: 'JetBrains Mono'; font-size: 12px; font-weight: 700; color: var(--gray); }
        .af-root .module h3 { font-family: 'Inter'; font-weight: 800; font-size: 18px; text-transform: none; margin: 10px 0 8px; }
        .af-root .module p { font-size: 13px; color: var(--gray); line-height: 1.55; margin: 0; }
        .af-root .module .chip {
          display: inline-block; margin-top: 14px; font-family: 'JetBrains Mono'; font-size: 11px;
          background: var(--yellow); border: 2px solid var(--black); padding: 3px 8px; border-radius: 2px; font-weight: 700;
        }

        .af-root .pipeline { display: flex; align-items: stretch; overflow-x: auto; gap: 0; border: 2px solid var(--black); }
        .af-root .pipe-step { flex: 1; min-width: 150px; padding: 26px 18px; position: relative; background: var(--white); border-right: 2px solid var(--black); }
        .af-root .pipe-step:last-child { border-right: none; }
        .af-root .pipe-step:nth-child(odd) { background: var(--paper); }
        .af-root .pipe-step .n { font-family: 'JetBrains Mono'; font-size: 11px; color: var(--gray); }
        .af-root .pipe-step h4 { font-family: 'Inter'; font-weight: 800; font-size: 14px; text-transform: none; margin-top: 8px; }
        .af-root .pipe-step::after {
          content: "→"; position: absolute; right: -14px; top: 50%; transform: translateY(-50%);
          font-family: 'JetBrains Mono'; font-weight: 700; color: var(--black); z-index: 2; background: var(--yellow);
          width: 26px; height: 26px; border: 2px solid var(--black); border-radius: 50%;
          display: flex; align-items: center; justify-content: center; font-size: 13px;
        }
        .af-root .pipe-step:last-child::after { display: none; }

        .af-root .dash { display: grid; grid-template-columns: repeat(4,1fr); gap: 2px; background: var(--black); border: 2px solid var(--black); }
        @media (max-width: 900px) { .af-root .dash { grid-template-columns: repeat(2,1fr); } }
        .af-root .dash-card { background: var(--white); padding: 24px 20px; }
        .af-root .dash-card .label { font-family: 'JetBrains Mono'; font-size: 11px; color: var(--gray); text-transform: uppercase; }
        .af-root .dash-card .num { font-family: 'Archivo Black'; font-size: 36px; margin-top: 8px; }
        .af-root .dash-card.hl { background: var(--black); color: var(--white); }
        .af-root .dash-card.hl .label { color: #cfcdc2; }
        .af-root .dash-card.hl .num { color: var(--yellow); }

        .af-root .cta-band { background: var(--black); color: var(--white); text-align: center; padding: 90px 0; border-bottom: 3px solid var(--black); }
        .af-root .cta-band h2 { color: var(--white); font-size: clamp(30px, 4.4vw, 50px); }
        .af-root .cta-band .hl { color: var(--yellow); }
        .af-root .cta-band p { color: #cfcdc2; margin: 18px auto 34px; max-width: 480px; font-size: 15px; }

        .af-root footer { padding: 36px 0; }
        .af-root .foot-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
        .af-root .foot-row .mono { font-size: 12px; color: var(--gray); }

        @media (prefers-reduced-motion: reduce) {
          .af-root * { animation: none !important; transition: none !important; }
        }
      ` }} />

            <header>
                <div className="wrap">
                    <nav>
                        <div className="logo">
                            AssetFlow <span className="tag">AF-SYS</span>
                        </div>
                        <div className="navlinks">
                            <a href="#problem">Problem</a>
                            <a href="#modules">Modules</a>
                            <a href="#workflow">Workflow</a>
                            <a href="#dashboard">Dashboard</a>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <a href="/login" className="btn3d small ghost">
                                Sign In
                            </a>
                            <a href="#cta" className="btn3d small">
                                Request Demo
                            </a>
                        </div>
                    </nav>
                </div>
            </header>

            <div className="stripe-thin" />

            <section className="hero" style={{ borderBottom: "none" }}>
                <div className="hero-grid-bg" />
                <div
                    className="hero-dot"
                    style={{ top: "20%", left: "8%", animationDuration: "5s", animationDelay: `${dotDelays[0]}s` }}
                />
                <div
                    className="hero-dot"
                    style={{ top: "65%", left: "14%", animationDuration: "7s", animationDelay: `${dotDelays[1]}s` }}
                />
                <div
                    className="hero-dot"
                    style={{ top: "40%", left: "4%", animationDuration: "6s", animationDelay: `${dotDelays[2]}s` }}
                />
                <div className="wrap hero-inner">
                    <div>
                        <div className="eyebrow">
                            <span className="live-dot" /> LIVE · 14 ASSETS UPDATED IN THE LAST HOUR
                        </div>
                        <h1>
                            Every asset,
                            <br />
                            <span className="hl">tagged.</span>
                            <br />
                            Tracked. Accounted for.
                        </h1>
                        <p className="sub">
                            Laptops go missing. Rooms get double-booked. Vehicles get allocated twice.
                            AssetFlow replaces the spreadsheet with one system that always knows who has
                            what, where it is, and when it&rsquo;s due back.
                        </p>
                        <div className="hero-ctas">
                            <a href="/login" className="btn3d">
                                Sign In (Admin)
                            </a>
                            <a href="#modules" className="btn3d ghost">
                                See what&rsquo;s inside
                            </a>
                        </div>
                    </div>
                    <div className="tag-card">
                        <div className="tag-row">
                            <span>ASSET TAG</span>
                            <span>DEPT: IT</span>
                        </div>
                        <div className="tag-code">AF-0231</div>
                        <span className="tag-status">
                            <span className="d" /> ALLOCATED
                        </span>
                        <div className="tag-meta">
                            Holder: <b>J. Mehta</b>
                            <br />
                            Location: <b>4th Floor — Bay 3</b>
                            <br />
                            Warranty: <b>Until Mar 2027</b>
                            <br />
                            Last audit: <b>Verified, 3 days ago</b>
                        </div>
                    </div>
                </div>
            </section>

            <div className="ticker-wrap">
                <div className="wrap" style={{ padding: 0 }}>
                    <div className="ticker-track">
                        <span className="ticker-label">● LIVE FEED</span>
                        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                            <span key={i}>
                                <b>{item.bold}</b> {item.text}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <section id="problem">
                <div className="wrap">
                    <div className="section-head">
                        <div className="kicker">THE PROBLEM</div>
                        <h2>Spreadsheets don&rsquo;t know where your stuff is.</h2>
                        <p className="lead">
                            Most companies still run asset tracking on Excel and paper trails. That works
                            until it doesn&rsquo;t.
                        </p>
                    </div>
                    <div className="problem-grid">
                        {[
                            ["01", "Lost equipment", "Laptops leave with employees and never get logged as returned."],
                            ["02", "Double bookings", "Two teams show up to the same meeting room at the same time."],
                            ["03", "Duplicate allocation", "The same vehicle gets assigned to two people on the same day."],
                            ["04", "Forgotten maintenance", "Nobody tracks warranty windows or service schedules until something breaks."],
                            ["05", "No clear owner", "Ask who has a given asset right now, and nobody has a confident answer."],
                            ["06", "Slow audits", "Physical audits take weeks of manual cross-checking against old sheets."],
                            ["07", "Siloed departments", "HR, IT, and Finance all keep their own separate, conflicting records."],
                            ["08", "No paper trail", "Transfers and returns happen over chat messages nobody can find later."],
                        ].map(([num, title, copy]) => (
                            <div className="problem-card" key={num}>
                                <div className="num">{num}</div>
                                <h3>{title}</h3>
                                <p>{copy}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="modules">
                <div className="wrap">
                    <div className="section-head">
                        <div className="kicker">THE SYSTEM</div>
                        <h2>One record. Every asset, every move.</h2>
                        <p className="lead">
                            AssetFlow centralizes registration, allocation, transfers, bookings, maintenance,
                            and audits into a single source of truth.
                        </p>
                    </div>
                    <div className="module-grid">
                        {[
                            ["MODULE / REGISTER", "Asset Registration", "Every asset gets a code, a QR tag, a category, and a paper trail from day one.", "AF-0001 →"],
                            ["MODULE / ALLOCATE", "Allocation & Transfer", "Assign assets to people, approve transfers, and make double-allocation impossible.", "No duplicates"],
                            ["MODULE / BOOK", "Resource Booking", "Rooms, cars, and projectors on a shared calendar with automatic conflict detection.", "Zero clashes"],
                            ["MODULE / MAINTAIN", "Maintenance", "Employees report issues, managers approve, technicians close the loop — all logged.", "Nothing forgotten"],
                            ["MODULE / AUDIT", "Audit Cycles", "Assign auditors, verify assets in the field, and generate a report in minutes, not weeks.", "Fast & verified"],
                            ["MODULE / REPORT", "Reports & Exports", "Asset, department, maintenance, and audit reports — exportable as PDF, Excel, or CSV.", "One click out"],
                        ].map(([code, title, copy, chip]) => (
                            <div className="module" key={code}>
                                <div className="code">{code}</div>
                                <h3>{title}</h3>
                                <p>{copy}</p>
                                <span className="chip">{chip}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="workflow">
                <div className="wrap">
                    <div className="section-head">
                        <div className="kicker">HOW IT FLOWS</div>
                        <h2>From purchase order to retirement.</h2>
                        <p className="lead">The full lifecycle of an asset, tracked automatically at every step.</p>
                    </div>
                    <div className="pipeline">
                        {[
                            ["STEP 1", "Register asset"],
                            ["STEP 2", "Allocate to employee"],
                            ["STEP 3", "In active use"],
                            ["STEP 4", "Maintenance if needed"],
                            ["STEP 5", "Transfer or return"],
                            ["STEP 6", "Audit & verify"],
                        ].map(([n, title]) => (
                            <div className="pipe-step" key={n}>
                                <div className="n">{n}</div>
                                <h4>{title}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="dashboard" style={{ borderBottom: "none" }}>
                <div className="wrap">
                    <div className="section-head">
                        <div className="kicker">THE DASHBOARD</div>
                        <h2>Live numbers, not a stale export.</h2>
                        <p className="lead">Every card updates the moment something changes on the floor.</p>
                    </div>
                    <div className="dash">
                        {COUNTERS.map((c) => (
                            <div className={`dash-card${c.dark ? " hl" : ""}`} key={c.label}>
                                <div className="label">{c.label}</div>
                                <AnimatedCounter target={c.target} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="cta-band" id="cta">
                <div className="wrap">
                    <div className="kicker" style={{ justifyContent: "center", color: "var(--yellow)" }}>
                        <span style={{ width: 24, height: 3, background: "var(--yellow)", display: "inline-block" }} />
                        READY WHEN YOU ARE
                    </div>
                    <h2>
                        Tag it once. <span className="hl">Never lose it again.</span>
                    </h2>
                    <p>See AssetFlow running on your own department structure in a 20-minute walkthrough.</p>
                    <a href="#" className="btn3d">
                        Request a demo
                    </a>
                </div>
            </div>

            <footer>
                <div className="wrap foot-row">
                    <div className="logo" style={{ fontSize: 16 }}>
                        AssetFlow <span className="tag">AF-SYS</span>
                    </div>
                    <div className="mono">© 2026 AssetFlow · Enterprise Asset & Resource Management</div>
                </div>
            </footer>
        </div>
    );
}