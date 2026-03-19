import { useState, useEffect, useMemo } from "react";
import VaporizeTextCycle from "./VaporizeText";

const HERO_TEXTS = ["Faster, Better YouTube Downloader", "Save Any Video Now", "Fast & 100% Free"];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --red: #ffffff;
    --purple: #dc2626;
    --brand-gradient: linear-gradient(135deg, #f43f5e 0%, #dc2626 50%, #991b1b 100%);
    --brand-glow: rgba(220, 38, 38, 0.35);
    --red-dim: #991b1b;
    --red-glow: rgba(255, 255, 255, 0.08);
    --red-glow-strong: rgba(220, 38, 38, 0.45);
    --bg: #09090b;
    --bg2: #0f0f12;
    --bg3: #1a1a1f;
    --bg4: #252530;
    --border: rgba(255, 255, 255, 0.07);
    --border-hover: rgba(255, 255, 255, 0.15);
    --text: #F5F5F7;
    --text2: #A1A1AA;
    --text3: #63636e;
    --font-display: 'Plus Jakarta Sans', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: radial-gradient(circle at 50% 0%, var(--bg2) 0%, var(--bg) 100%);
    color: var(--text);
    font-family: var(--font-body);
    font-size: 15px;
    line-height: 1.6;
    overflow-x: hidden;
    min-height: 100vh;
  }

  /* NOISE OVERLAY */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 999;
    opacity: 0.5;
  }

  /* NAVBAR */
  .nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    padding: 0 2rem;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.06) inset, 0 4px 30px rgba(0, 0, 0, 0.1);
  }
  .nav.scrolled {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(30px) saturate(200%);
    -webkit-backdrop-filter: blur(30px) saturate(200%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.08) inset, 0 8px 32px rgba(0, 0, 0, 0.2);
  }
  .nav-logo {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--text);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .nav-logo span { background: var(--brand-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .nav-links {
    display: flex;
    gap: 2rem;
    list-style: none;
  }
  .nav-links a, .nav-link {
    color: var(--text2);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 400;
    transition: color 0.2s;
    cursor: pointer;
  }
  .nav-links a:hover, .nav-link:hover, .nav-links a.active, .nav-link.active { color: var(--text); }
  .nav-cta {
    background: var(--brand-gradient);
    color: #fff;
    border: none;
    padding: 0.5rem 1.25rem;
    border-radius: 6px;
    font-family: var(--font-body);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  .nav-cta:hover { filter: brightness(1.1); transform: translateY(-1px); }

  .nav-hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
    padding: 4px;
    background: none;
    border: none;
  }
  .nav-hamburger span {
    display: block;
    width: 22px;
    height: 2px;
    background: var(--text);
    border-radius: 2px;
    transition: all 0.3s;
  }
  .mobile-menu {
    display: none;
    position: fixed;
    top: 64px; left: 0; right: 0;
    background: rgba(10,10,10,0.97);
    backdrop-filter: blur(20px);
    padding: 1.5rem 2rem;
    flex-direction: column;
    gap: 1.25rem;
    z-index: 99;
    border-bottom: 1px solid var(--border);
  }
  .mobile-menu.open { display: flex; }
  .mobile-menu a, .mobile-menu span { color: var(--text2); text-decoration: none; font-size: 1rem; cursor: pointer; }

  /* HERO */
  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 6rem 1.5rem 6rem;
    position: relative;
    text-align: center;
    overflow: hidden;
  }
  .features, .how, .faq { position: relative; overflow: hidden; }
  
  .decoration-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }
  
  .spotlight {
    position: absolute;
    background: radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%);
    filter: blur(100px);
    border-radius: 50%;
  }
  
  .spotlight-hero { top: -20%; left: 50%; transform: translateX(-50%); width: 100vw; height: 60vw; opacity: 0.8; }
  .spotlight-right { top: 20%; right: -15%; width: 50vw; height: 50vw; opacity: 0.5; }
  .spotlight-left { top: 30%; left: -15%; width: 50vw; height: 50vw; opacity: 0.5; }
  .spotlight-bottom { bottom: -10%; left: 50%; transform: translateX(-50%); width: 70vw; height: 40vw; opacity: 0.6; }

  .grid-pattern {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(circle at center, black, transparent 90%);
    z-index: 0;
  }
  .floating-blob {
    position: absolute;
    background: var(--brand-gradient);
    filter: blur(100px);
    opacity: 0.06;
    border-radius: 50%;
    z-index: 0;
  }
  .blob-1 { width: 400px; height: 400px; top: 10%; left: -10%; animation: float-1 20s infinite alternate; }
  .blob-2 { width: 400px; height: 400px; bottom: 10%; right: -10%; animation: float-2 25s infinite alternate; }
  .blob-3 { width: 300px; height: 300px; top: 50%; left: 80%; animation: float-1 15s infinite alternate-reverse; }
  
  @keyframes float-1 {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(100px, 50px) scale(1.1); }
  }
  @keyframes float-2 {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(-80px, -60px) scale(0.9); }
  }
  
  .section-content { position: relative; z-index: 1; }
  .hero h1 {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(2.2rem, 5.5vw, 4rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.01em;
    margin-bottom: 1.25rem;
    animation: fadeUp 0.6s 0.1s ease both;
    position: relative;
    z-index: 1;
  }
  .hero h1 em {
    font-style: normal;
    background: var(--brand-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: block;
  }
  .hero-sub {
    color: var(--text2);
    font-size: 1.05rem;
    font-weight: 300;
    max-width: 480px;
    margin: 0 auto 2.5rem;
    line-height: 1.7;
    animation: fadeUp 0.6s 0.2s ease both;
    position: relative;
    z-index: 1;
  }

  /* INPUT BOX */
  .input-wrap {
    width: 100%;
    max-width: 580px;
    animation: fadeUp 0.6s 0.3s ease both;
    position: relative;
    z-index: 1;
  }
  .input-row {
    display: flex;
    gap: 10px;
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 6px 6px 6px 16px;
    align-items: center;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .input-row:focus-within {
    border-color: rgba(127, 29, 29, 0.4);
    box-shadow: 0 0 0 3px var(--brand-glow);
  }
  .input-row.error {
    border-color: rgba(153, 27, 27,0.7);
    box-shadow: 0 0 0 3px var(--red-glow-strong);
  }
  .input-row input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    color: var(--text);
    font-family: var(--font-body);
    font-size: 0.9rem;
    font-weight: 300;
    min-width: 0;
  }
  .input-row input::placeholder { color: var(--text3); }
  .input-icon { color: var(--text3); display: flex; align-items: center; flex-shrink: 0; }
  .error-msg {
    margin-top: 8px;
    color: #991b1b;
    font-size: 0.8rem;
    text-align: left;
    padding-left: 4px;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  /* BUTTONS */
  .btn-primary {
    background: var(--brand-gradient);
    color: #ffffff; /* White text for better contrast */
    border: none;
    padding: 0.65rem 1.4rem;
    border-radius: 8px;
    font-family: var(--font-body);
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    gap: 7px;
    white-space: nowrap;
    box-shadow: 0 4px 15px rgba(153, 27, 27, 0.3);
    flex-shrink: 0;
  }
  .btn-primary:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 20px rgba(153, 27, 27, 0.45);
  }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .btn-primary.loading { position: relative; pointer-events: none; }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  /* TRUST PILLS */
  .trust-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-top: 3rem;
    animation: fadeUp 0.6s 0.5s ease both;
    position: relative;
    z-index: 1;
  }
  .trust-pill {
    display: flex;
    align-items: center;
    gap: 7px;
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 7px 14px;
    font-size: 0.8rem;
    color: var(--text2);
    font-weight: 400;
  }
  .trust-pill svg { color: var(--purple); flex-shrink: 0; }

  /* RESULT SECTION */
  .result-section {
    width: 100%;
    max-width: 580px;
    margin-top: 1.5rem;
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    animation: fadeUp 0.4s ease both;
    position: relative;
    z-index: 1;
  }
  .result-video-row {
    display: flex;
    gap: 14px;
    padding: 16px;
    border-bottom: 1px solid var(--border);
    align-items: center;
  }
  .result-thumb {
    width: 100px;
    height: 62px;
    border-radius: 8px;
    background: var(--bg3);
    object-fit: cover;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text3);
    overflow: hidden;
    position: relative;
  }
  .thumb-placeholder {
    width: 100px;
    height: 62px;
    background: linear-gradient(135deg, var(--bg3) 0%, var(--bg4) 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .result-info { flex: 1; min-width: 0; }
  .result-title {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 4px;
  }
  .result-meta { font-size: 0.75rem; color: var(--text3); }
  .result-duration {
    font-size: 0.75rem;
    background: rgba(0,0,0,0.6);
    color: var(--text);
    padding: 2px 6px;
    border-radius: 4px;
    position: absolute;
    bottom: 4px; right: 4px;
  }
  .download-grid {
    display: grid;
    grid-template-columns: 1fr 1px 1fr;
    gap: 0;
  }
  .download-col { padding: 14px 16px; }
  .download-col-div { background: var(--border); }
  .download-col-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--text3);
    margin-bottom: 10px;
    font-weight: 500;
  }
  .dl-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 10px;
    border-radius: 7px;
    background: none;
    border: 1px solid var(--border);
    color: var(--text);
    font-family: var(--font-body);
    font-size: 0.8rem;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 6px;
    width: 100%;
  }
  .dl-btn:last-child { margin-bottom: 0; }
  .dl-btn:hover { background: var(--bg3); border-color: var(--border-hover); }
  .dl-btn.downloading {
    border-color: rgba(127, 29, 29,0.3);
    background: rgba(127, 29, 29,0.05);
    color: var(--purple);
  }
  .dl-btn.done {
    border-color: rgba(40,180,100,0.3);
    background: rgba(40,180,100,0.05);
    color: #40c070;
  }
  .dl-icon { opacity: 0.5; display: flex; }
  .dl-badge {
    font-size: 0.68rem;
    background: var(--bg3);
    border: 1px solid var(--border);
    color: var(--text2);
    padding: 2px 6px;
    border-radius: 4px;
  }

  /* FEATURES */
  .features {
    padding: 6rem 1.5rem;
    max-width: 1100px;
    margin: 0 auto;
  }
  .section-eyebrow {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--purple);
    margin-bottom: 0.75rem;
    font-weight: 500;
  }
  .section-title {
    font-family: var(--font-display);
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 3.5rem;
    max-width: 500px;
    line-height: 1.1;
  }
  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
  }
  .feature-card {
    background: var(--bg2);
    padding: 1.75rem;
    transition: background 0.2s;
  }
  .feature-card:hover { background: var(--bg3); }
  .feature-icon {
    width: 44px; height: 44px;
    background: rgba(220, 38, 38, 0.1);
    border: 1px solid rgba(220, 38, 38, 0.25);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    color: #f43f5e;
    font-size: 1.1rem;
    box-shadow: 0 0 20px rgba(220, 38, 38, 0.12);
  }
  .feature-card h3 {
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    letter-spacing: -0.01em;
  }
  .feature-card p { font-size: 0.875rem; color: var(--text2); line-height: 1.6; font-weight: 300; }

  /* HOW IT WORKS */
  .how {
    padding: 6rem 1.5rem;
    max-width: 900px;
    margin: 0 auto;
    text-align: center;
  }
  .steps-row {
    display: flex;
    align-items: flex-start;
    gap: 0;
    position: relative;
    margin-top: 3.5rem;
  }
  .steps-line {
    position: absolute;
    top: 28px;
    left: 15%;
    right: 15%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border), var(--purple), var(--border), transparent);
  }
  .step {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 0 1rem;
    position: relative;
  }
  .step-circle {
    width: 56px; height: 56px;
    border-radius: 50%;
    background: var(--bg2);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text2);
    position: relative;
    z-index: 1;
    transition: all 0.3s;
  }
  .step:hover .step-circle {
    border-color: var(--purple);
    color: var(--purple);
    background: rgba(127, 29, 29,0.06);
  }
  .step.active .step-circle {
    border-color: transparent;
    background: var(--brand-gradient);
    color: #fff;
    box-shadow: 0 0 20px var(--brand-glow);
  }
  .step h4 {
    font-family: var(--font-display);
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .step p { font-size: 0.8rem; color: var(--text2); line-height: 1.5; font-weight: 300; }

  /* FAQ */
  .faq {
    padding: 6rem 1.5rem;
    max-width: 700px;
    margin: 0 auto;
  }
  .faq-item {
    border-bottom: 1px solid var(--border);
    overflow: hidden;
  }
  .faq-item:first-of-type { border-top: 1px solid var(--border); }
  .faq-q {
    width: 100%;
    background: none;
    border: none;
    color: var(--text);
    font-family: var(--font-body);
    font-size: 0.95rem;
    font-weight: 400;
    text-align: left;
    padding: 1.2rem 0;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    transition: color 0.2s;
  }
  .faq-q:hover { color: var(--purple); }
  .faq-icon {
    flex-shrink: 0;
    width: 20px; height: 20px;
    border: 1px solid var(--border);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    color: var(--text3);
    transition: all 0.3s;
  }
  .faq-item.open .faq-icon {
    transform: rotate(45deg);
    border-color: var(--purple);
    color: var(--purple);
  }
  .faq-body {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.35s ease;
  }
  .faq-item.open .faq-body { max-height: 200px; }
  .faq-body p { color: var(--text2); font-size: 0.875rem; padding-bottom: 1.25rem; line-height: 1.7; font-weight: 300; }

  /* FOOTER */
  footer {
    border-top: 1px solid var(--border);
    padding: 4rem 2rem 2rem;
  }
  .footer-top {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 2rem;
    margin-bottom: 3rem;
  }
  .footer-brand {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--text);
    margin-bottom: 0.75rem;
  }
  .footer-brand span { background: var(--brand-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .footer-tagline {
    font-size: 0.85rem;
    color: var(--text3);
    line-height: 1.6;
    font-weight: 300;
  }
  .footer-col-title {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text3);
    font-weight: 500;
    margin-bottom: 1rem;
  }
  .footer-col-links {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
  .footer-col-links span {
    font-size: 0.875rem;
    color: var(--text2);
    cursor: pointer;
    transition: color 0.2s;
    font-weight: 300;
  }
  .footer-col-links span:hover { color: var(--text); }
  .footer-bottom {
    border-top: 1px solid var(--border);
    padding-top: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  .footer-copy { font-size: 0.78rem; color: var(--text3); }
  .footer-pills {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .footer-pill {
    font-size: 0.72rem;
    background: var(--bg2);
    border: 1px solid var(--border);
    color: var(--text3);
    padding: 3px 10px;
    border-radius: 100px;
  }



  /* TOAST */
  .toast-container {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 8px;
    pointer-events: none;
  }
  .toast {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    font-size: 0.875rem;
    font-weight: 400;
    pointer-events: all;
    animation: slideIn 0.3s ease both;
    max-width: 300px;
    border: 1px solid;
  }
  .toast.success {
    background: rgba(40,180,100,0.12);
    border-color: rgba(40,180,100,0.25);
    color: #50d080;
  }
  .toast.error {
    background: rgba(153, 27, 27,0.12);
    border-color: rgba(153, 27, 27,0.25);
    color: #991b1b;
  }
  .toast.info {
    background: rgba(255,255,255,0.06);
    border-color: var(--border);
    color: var(--text2);
  }
  .toast.hide { animation: slideOut 0.3s ease both; }

  /* ANIMATIONS */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.85); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(16px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideOut {
    from { opacity: 1; transform: translateX(0); }
    to   { opacity: 0; transform: translateX(16px); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* RESPONSIVE */

  /* Tablet landscape and below */
  @media (max-width: 1024px) {
    .features-grid { grid-template-columns: repeat(2, 1fr); }
    .footer-top { grid-template-columns: 1fr 1fr; gap: 2rem; }
    .hero { padding: 5rem 1.25rem 3rem; }
    .features, .how, .faq { padding: 4rem 1.25rem; }
  }

  /* Tablet portrait and below */
  @media (max-width: 768px) {
    .nav { padding: 0 1.25rem; }
    .nav-links, .nav-cta { display: none; }
    .nav-hamburger { display: flex; }
    .hero { min-height: auto; padding: 6rem 1rem 3rem; }
    .hero-sub { font-size: 0.95rem; max-width: 90%; }
    .vaporize-wrap { height: 60px !important; }
    .input-wrap { max-width: 100%; }
    .features-grid { grid-template-columns: repeat(2, 1fr); }
    .feature-card { padding: 1.25rem; }
    .section-title { font-size: clamp(1.5rem, 5vw, 2.2rem); margin-bottom: 2.5rem; }
    .steps-row { flex-direction: column; gap: 2rem; position: relative; margin-top: 2.5rem; }
    .steps-line { display: block; position: absolute; left: 24px; top: 0; bottom: 0; width: 1px; height: 100%; background: linear-gradient(to bottom, transparent, var(--border), var(--purple), var(--border), transparent); z-index: 0; }
    .step { padding: 0; flex-direction: row; text-align: left; gap: 1.25rem; align-items: flex-start; z-index: 1; }
    .step-circle { width: 48px; height: 48px; min-width: 48px; font-size: 0.85rem; }
    .step-content { display: flex; flex-direction: column; gap: 0.25rem; padding-top: 4px; }
    .step p { max-width: 100%; font-size: 0.825rem; }
    .step h4 { font-size: 0.95rem; }
    .trust-pills { gap: 8px; }
    .trust-pill { padding: 6px 12px; font-size: 0.75rem; }
    .footer-top { grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .toast-container { right: 1rem; bottom: 1rem; left: 1rem; }
    .toast { max-width: 100%; }
  }

  /* Mobile */
  @media (max-width: 480px) {
    .nav { padding: 0 1rem; height: 56px; }
    .nav-logo { font-size: 1.1rem; }
    .mobile-menu { top: 56px; padding: 1.25rem 1rem; }
    .hero { padding: 4.5rem 1rem 2rem; }
    .vaporize-wrap { height: 60px !important; }
    .hero-sub { font-size: 0.875rem; margin-bottom: 1.5rem; }
    .input-row { flex-direction: column; padding: 10px; gap: 8px; }
    .input-row input { width: 100%; font-size: 0.85rem; }
    .btn-primary { width: 100%; justify-content: center; padding: 0.6rem 1rem; }
    .features { padding: 3rem 1rem; }
    .features-grid { grid-template-columns: 1fr; }
    .feature-card { padding: 1.25rem; }
    .feature-card h3 { font-size: 0.95rem; }
    .feature-card p { font-size: 0.8rem; }
    .how, .faq { padding: 3rem 1rem; }
    .section-eyebrow { font-size: 0.7rem; }
    .section-title { font-size: 1.4rem; margin-bottom: 2rem; }
    .faq-q { font-size: 0.875rem; padding: 1rem 0; }
    .faq-body p { font-size: 0.8rem; }
    .download-grid { grid-template-columns: 1fr; }
    .download-col-div { display: none; }
    .result-video-row { flex-direction: column; gap: 10px; align-items: flex-start; }
    .result-thumb, .thumb-placeholder { width: 100%; height: 120px; }
    .trust-pills { flex-direction: column; align-items: center; gap: 6px; }
    .trust-pill { width: 100%; justify-content: center; }
    footer { padding: 2.5rem 1rem 1.5rem; }
    .footer-top { grid-template-columns: 1fr; gap: 1.5rem; text-align: center; }
    .footer-col-links { align-items: center; }
    .footer-bottom { flex-direction: column; text-align: center; gap: 1rem; }
    .footer-pills { justify-content: center; }
    .footer-copy { font-size: 0.72rem; }
  }
`;


// Premium SVG Icons
const IconLink = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);
const IconSearch = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconDownload = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const IconCheck = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconPlay = ({ size = 20, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={style}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
const IconFilm = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" />
    <line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="17" x2="22" y2="17" />
    <line x1="17" y1="7" x2="22" y2="7" />
  </svg>
);
const IconMusic = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
  </svg>
);
const IconShield = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconZap = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const IconInfinity = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4z" />
    <path d="M12 12c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z" />
  </svg>
);
const IconClipboard = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);
const IconSliders = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);
const IconAlert = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);


// ─── Backend API config ───────────────────────────────────────────────
// Jab backend ready ho tab yahan apna URL daal dena
const API_BASE = "/api";


export default function ZapClip() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dlStates, setDlStates] = useState({});
  const [toasts, setToasts] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [activeSection, setActiveSection] = useState("home");
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, behavior: "smooth" });
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = ["home", "features", "how", "faq"];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const addToast = (msg, type = "info") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  };

 const validateUrl = (v) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|instagram\.com|tiktok\.com|twitter\.com|x\.com|facebook\.com|vimeo\.com|reddit\.com).+/i;
    return regex.test(v.trim());
};

  // ─── Step 1: URL validate karo, backend se video info fetch karo ──────
  const handleConvert = async () => {
    if (!url.trim()) { setError("Please paste a YouTube URL first."); return; }
    if (!validateUrl(url)) { setError("Invalid YouTube URL — please paste a valid link."); return; }
    setError("");
    setResult(null);
    setDlStates({});
    setLoading(true);
    setActiveStep(1);
    try {
      // Backend se video title, thumbnail, duration fetch hoga
      // Expected response: { title, channel, thumbnail, duration }
      const res = await fetch(`${API_BASE}/info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Could not fetch video info.");
      }
      const data = await res.json();
      setResult(data);
      setActiveStep(2);
      addToast("Video fetched successfully!", "success");
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
      addToast(e.message || "Failed to fetch video.", "error");
      setActiveStep(0);
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 2: Format choose karo, direct download trigger karo ─────────
  const handleDownload = (key, format, quality) => {
    if (dlStates[key]) return;
    setDlStates(p => ({ ...p, [key]: "downloading" }));
    addToast(`Starting ${quality} download...`, "info");

    // Backend download URL — file stream karega browser seedha download karega
    const params = new URLSearchParams({
      url: url.trim(),
      format,   // "mp4" ya "mp3"
      quality,  // "1080", "720", "360", "320", "192", "128"
    });
    const downloadUrl = `${API_BASE}/download?${params.toString()}`;

    // Invisible anchor se download trigger karo
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // 3 sec baad done state
    setTimeout(() => {
      setDlStates(p => ({ ...p, [key]: "done" }));
      addToast(`${quality} download started!`, "success");
      setTimeout(() => setDlStates(p => ({ ...p, [key]: null })), 3000);
    }, 3000);
  };

  const DlBtn = ({ id, label, badge, format, quality }) => {
    const s = dlStates[id];
    return (
      <button
        className={`dl-btn${s === "downloading" ? " downloading" : s === "done" ? " done" : ""}`}
        onClick={() => handleDownload(id, format, quality)}
        disabled={!!s}
      >
        <span>{label}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {badge && <span className="dl-badge">{badge}</span>}
          <span className="dl-icon">
            {s === "downloading"
              ? <div className="spinner" style={{ width: 12, height: 12, borderWidth: 1.5 }} />
              : s === "done" ? <IconCheck /> : <IconDownload />}
          </span>
        </span>
      </button>
    );
  };

  const faqs = [
    { q: "Is ZapClip free to use?", a: "Yes, ZapClip is completely free. No hidden fees, no subscription required. Just paste your link and download." },
    { q: "Is it legal to download YouTube videos?", a: "Downloading is permitted only for personal use on content you own or that has a Creative Commons license. Always respect copyright law and YouTube's terms of service." },
    { q: "What formats are supported?", a: "We support MP4 video (360p, 720p HD, 1080p Full HD) and MP3 audio (128kbps, 192kbps, 320kbps High Quality)." },
    { q: "Do I need to create an account?", a: "No registration required. ZapClip works instantly — no accounts, no tracking, no stored data." },
    { q: "How fast are the downloads?", a: "Conversions are processed instantly on our servers. Download speed depends on your internet connection, but there's no throttling or queue on our end." },
  ];

  return (
    <>
      <style>{styles}</style>

      {/* NAVBAR */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <span className="nav-logo" style={{ cursor: "pointer" }} onClick={() => scrollTo("home")}>Zap<span>Clip</span></span>
        <ul className="nav-links">
          <li><span className={`nav-link${activeSection === "features" ? " active" : ""}`} onClick={() => scrollTo("features")}>Features</span></li>
          <li><span className={`nav-link${activeSection === "how" ? " active" : ""}`} onClick={() => scrollTo("how")}>How-To-Use</span></li>
          <li><span className={`nav-link${activeSection === "faq" ? " active" : ""}`} onClick={() => scrollTo("faq")}>FAQ</span></li>
        </ul>
        <button className="nav-cta" onClick={() => scrollTo("home")}>
          Get Started
        </button>
        <button className="nav-hamburger" onClick={() => setMobileOpen(o => !o)}>
          <span /><span /><span />
        </button>
      </nav>
      <div className={`mobile-menu${mobileOpen ? " open" : ""}`}>
        <span className="nav-link" onClick={() => { scrollTo("features"); setMobileOpen(false); }}>Features</span>
        <span className="nav-link" onClick={() => { scrollTo("how"); setMobileOpen(false); }}>How-To-Use</span>
        <span className="nav-link" onClick={() => { scrollTo("faq"); setMobileOpen(false); }}>FAQ</span>
      </div>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="decoration-layer">
          <div className="grid-pattern" />
          <div className="spotlight spotlight-hero" />
          <div className="floating-blob blob-1" />
          <div className="floating-blob blob-2" />
        </div>

        <div className="vaporize-wrap" style={{ position: "relative", zIndex: 1, height: "80px", width: "100%", marginBottom: "1.25rem" }}>
          <VaporizeTextCycle
            texts={windowWidth < 480 ? ["Fast YouTube Downloader", "Save Any Video", "100% Free & Fast"] : HERO_TEXTS}
            font={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: windowWidth < 480 ? `${Math.floor(windowWidth / 18)}px` : windowWidth < 768 ? "32px" : "48px",
              fontWeight: 800
            }}
            color="rgb(255, 255, 255)"
            spread={6}
            density={8}
            animation={{
              vaporizeDuration: 2,
              fadeInDuration: 1,
              waitDuration: 1.5
            }}
            direction="left-to-right"
            alignment="center"
          />
        </div>

        <p className="hero-sub">
          Download videos & audio from YouTube, Instagram, Twitter, TikTok, Facebook and 1000+ more sites. No ads, no signups, 100% free.
        </p>

        <div className="input-wrap">
          <div className={`input-row${error ? " error" : ""}`}>
            <div className="input-icon"><IconLink size={18} /></div>
            <input
              type="text"
              placeholder="Paste YouTube video link here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConvert()}
            />
            <button className={`btn-primary${loading ? " loading" : ""}`} onClick={handleConvert} disabled={loading}>
              {loading ? "Discovering..." : <><IconSearch size={16} /> Download</>}
            </button>
          </div>
          {error && (
            <div className="error-msg">
              <IconAlert /> {error}
            </div>
          )}
        </div>

        {/* RESULT */}
        {result && (
          <div className="result-section">
            <div className="result-video-row">
             {result.thumbnail ? (
  <img 
  src={result.thumbnail} 
  alt="thumbnail"
  crossOrigin="anonymous"
  onError={(e) => { e.target.style.display = 'none'; }}
  style={{ width: 100, height: 62, objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
/>
) : (
  <div className="thumb-placeholder">
    <IconPlay style={{ color: "rgba(255,255,255,0.3)" }} />
  </div>
)}
              <div className="result-info">
                <div className="result-title">{result.title}</div>
                <div className="result-meta">{result.channel} &middot; {result.views}</div>
              </div>
            </div>
            <div className="download-grid">
              <div className="download-col">
                <div className="download-col-label">Video Downloads</div>
                <DlBtn id="v1080" label="1080p Full HD" badge="HD" format="mp4" quality="1080" />
                <DlBtn id="v720" label="720p HD" format="mp4" quality="720" />
                <DlBtn id="v360" label="360p SD" format="mp4" quality="360" />
              </div>
              <div className="download-col-div" />
              <div className="download-col">
                <div className="download-col-label">Audio Downloads</div>
                <DlBtn id="a320" label="320kbps High" badge="HQ" format="mp3" quality="320" />
                <DlBtn id="a192" label="192kbps Med" format="mp3" quality="192" />
                <DlBtn id="a128" label="128kbps Low" format="mp3" quality="128" />
              </div>
            </div>
          </div>
        )}

        {/* TRUST PILLS */}
        <div className="trust-pills">
          {[
            { icon: <IconFilm />, text: "MP4 • 360p / 720p / 1080p" },
            { icon: <IconMusic />, text: "MP3 • 128 / 192 / 320kbps" },
            { icon: <IconShield />, text: "No signup required" },
            { icon: <IconZap />, text: "Free forever" },
          ].map((p, i) => (
            <div className="trust-pill" key={i}>
              {p.icon} {p.text}
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <div className="decoration-layer">
          <div className="spotlight spotlight-right" />
          <div className="floating-blob blob-3" style={{ top: '40%', opacity: 0.04 }} />
        </div>
        <div className="section-content">
        <div className="section-eyebrow" style={{ textAlign: "center" }}>What you get</div>
        <h2 className="section-title" style={{ margin: "0 auto 3.5rem", maxWidth: "100%", textAlign: "center" }}>Everything you need, nothing you don't</h2>
        <div className="features-grid">
          {[
            { icon: <IconFilm />, title: "High-Quality MP4", desc: "1080p and 4K resolution without any quality loss during conversion." },
            { icon: <IconMusic />, title: "320kbps MP3", desc: "Studio-grade audio extraction for your high-fidelity music library." },
            { icon: <IconShield />, title: "No Registration", desc: "Quick, private, and secure. We never track your activity or require accounts." },
            { icon: <IconInfinity />, title: "Unlimited", desc: "No daily limits, no hidden queues, and no throttled speeds for any user." },
            { icon: <IconZap />, title: "Instant Processing", desc: "Our servers process your video in seconds, not minutes. No waiting." },
            { icon: <IconFilm />, title: "All Formats", desc: "MP4, MP3, WebM and more. Every device, every player, covered." },
          ].map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
        </div>
      </section >

      {/* HOW IT WORKS */}
      < section className="how" id="how" >
        <div className="decoration-layer">
          <div className="spotlight spotlight-left" />
        </div>
        <div className="section-content">
        <div className="section-eyebrow">Simple process</div>
        <h2 className="section-title" style={{ margin: "0 auto 0", textAlign: "center" }}>Simple in Three Steps</h2>
        <div className="steps-row">
          <div className="steps-line" />
          {[
            { icon: <IconClipboard />, title: "Paste Link", desc: "Copy the YouTube URL from your browser and paste it into the input bar above." },
            { icon: <IconSliders />, title: "Choose Format", desc: "Pick your desired resolution for video or audio bitrate for MP3 conversion." },
            { icon: <IconDownload />, title: "Download", desc: "Your file is processed instantly and ready for download in seconds." },
          ].map((s, i) => (
            <div className={`step${activeStep >= i ? " active" : ""}`} key={i}>
              <div className="step-circle">{s.icon}</div>
              <div className="step-content">
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </section >

      {/* FAQ */}
      < section className="faq" id="faq" >
        <div className="decoration-layer">
          <div className="spotlight spotlight-bottom" />
        </div>
        <div className="section-content">
        <div className="section-eyebrow" style={{ textAlign: "center" }}>Got questions?</div>
        <h2 className="section-title" style={{ margin: "0 auto 3rem", maxWidth: "100%", textAlign: "center" }}>Frequently asked questions</h2>
        {
          faqs.map((f, i) => (
            <div className={`faq-item${openFaq === i ? " open" : ""}`} key={i}>
              <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {f.q}
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-body"><p>{f.a}</p></div>
            </div>
          ))
        }
        </div>
      </section >

      {/* FOOTER */}
      < footer >
        <div className="footer-top">
          {/* Brand col */}
          <div>
            <div className="footer-brand">Zap<span>Clip</span></div>
            <div className="footer-tagline">
              Fast, free YouTube, Instagram, and TikTok video downloader. No signup, no limits, no nonsense.
            </div>
          </div>

          {/* Video col */}
          <div>
            <div className="footer-col-title">Video</div>
            <div className="footer-col-links">
              <span>MP4 — 1080p Full HD</span>
              <span>MP4 — 720p HD</span>
              <span>MP4 — 360p SD</span>
            </div>
          </div>

          {/* Audio col */}
          <div>
            <div className="footer-col-title">Audio</div>
            <div className="footer-col-links">
              <span>MP3 — 320kbps</span>
              <span>MP3 — 192kbps</span>
              <span>MP3 — 128kbps</span>
            </div>
          </div>

          {/* Navigate col */}
          <div>
            <div className="footer-col-title">Navigate</div>
            <div className="footer-col-links">
              <span onClick={() => scrollTo("home")}>Home</span>
              <span onClick={() => scrollTo("features")}>Features</span>
              <span onClick={() => scrollTo("how")}>How-To-Use</span>
              <span onClick={() => scrollTo("faq")}>FAQ</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">© 2026 ZapClip. All rights reserved.</div>
          <div className="footer-pills">
            <span className="footer-pill">No Signup</span>
            <span className="footer-pill">No Ads</span>
            <span className="footer-pill">Free Forever</span>
            <span className="footer-pill">No Data Stored</span>
          </div>
        </div>
      </footer >

      {/* TOASTS */}
      < div className="toast-container" >
        {
          toasts.map(t => (
            <div key={t.id} className={`toast ${t.type}`}>
              {t.type === "success" ? <IconCheck /> : t.type === "error" ? <IconAlert /> : null}
              {t.msg}
            </div>
          ))
        }
      </div >
    </>
  );
}
