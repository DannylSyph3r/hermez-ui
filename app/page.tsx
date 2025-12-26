"use client";

import { useState } from "react";
import TunnelBackground from "@/src/components/tunnel/TunnelBackground";

// SVG Icons as components - with purple gradient styling
const GithubIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const ZapIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const CodeIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const features = [
  { icon: ZapIcon, title: "Zero Config", desc: "One command. Live in seconds." },
  { icon: ShieldIcon, title: "Encrypted", desc: "End-to-end HTTPS tunnels." },
  { icon: SearchIcon, title: "Inspection", desc: "Real-time request replay." },
  { icon: GlobeIcon, title: "Custom Domains", desc: "Use your own domains." },
  { icon: CodeIcon, title: "Enterprise-Ready", desc: "Rock-solid reliability." },
];

export default function Home() {
  const [email, setEmail] = useState("");

  return (
    <div className="relative h-screen flex flex-col overflow-hidden font-[family-name:var(--font-geist-sans)] text-white">
      {/* Background (Z-0) */}
      <TunnelBackground />

      {/* Header (Z-20) */}
      <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between p-6">
        <h1 className="text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
          hermez.
        </h1>
        <a
          href="https://github.com/hermez"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-white/90 text-xs font-light hover:bg-white/15 hover:border-[#9F2B68]/60 transition-all duration-300"
        >
          <GithubIcon />
          <span>Star on GitHub</span>
        </a>
      </header>

      {/* Main Content (Z-10) */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-6 pt-16">
        <div className="max-w-4xl w-full text-center">
          {/* Tagline - Larger */}
          <p className="text-base md:text-lg text-white/40 font-[family-name:var(--font-geist-mono)] font-light tracking-widest uppercase mb-3">
            Tunneling to the future
          </p>

          {/* Main Headline - Larger with Serif/Sans Mix */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-white mb-4 leading-[1.1]">
            Bridge worlds at{" "}
            <span className="font-[family-name:var(--font-playfair)] italic">
              divine speed
            </span>
          </h2>

          {/* Subheadline - Larger */}
          <p className="text-white/50 text-base md:text-lg font-light max-w-2xl mx-auto leading-relaxed mb-10">
            An open-source ngrok alternative built for developers who need fast, reliable tunnels.
            Share your local server with anyone, anywhere.
          </p>

          {/* Waitlist Form */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto mb-8">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-full bg-white/5 border border-[#4E5180]/50 focus:outline-none focus:border-[#9F2B68]/70 backdrop-blur-sm transition-all text-white placeholder:text-white/30 text-sm"
            />
            <button className="px-6 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-gradient-to-r hover:from-[#9F2B68] hover:to-[#4E5180] hover:text-white transition-all duration-300">
              Join Waitlist
            </button>
          </div>

          {/* Code Example - Above Features */}
          <code className="inline-block px-4 py-2 rounded-lg bg-white/5 border border-white/10 font-[family-name:var(--font-geist-mono)] text-sm mb-20">
            <span className="text-[#9F2B68] font-bold">hermez</span>{" "}
            <span className="text-white/50">http 3000</span>
          </code>

          {/* Features Strip - With Descriptions */}
          <div className="flex flex-wrap justify-center items-start gap-x-8 gap-y-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 group"
              >
                <span className="text-[#6B2D5F] group-hover:text-[#9F2B68] transition-colors">
                  <feature.icon />
                </span>
                <div className="text-left">
                  <span className="text-white/80 text-xs font-medium">{feature.title}</span>
                  <span className="text-white/40 text-xs font-light ml-1">{feature.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer (Z-10) */}
      <footer className="relative z-10 py-4 px-6 text-center">
        <p className="text-white/30 text-xs font-light italic mb-1">
          Named after Hermes, the messenger of the gods.
        </p>
        <p className="text-white/20 text-[10px] font-[family-name:var(--font-geist-mono)]">
          © 2025 Hermez Inc.
        </p>
      </footer>
    </div>
  );
}
