"use client";

import {
  GithubIcon,
  ZapIcon,
  ShieldIcon,
  GlobeIcon,
  TerminalIcon,
  ArrowRightIcon,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen min-w-[900px] flex flex-col overflow-auto font-[family-name:var(--font-geist-sans)] text-white bg-black">

      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between p-6 backdrop-blur-sm bg-black/10">
        <div className="flex items-center gap-0">
          <img src="/hermez-logo.png" alt="Hermez Logo" className="h-12 w-auto" />
          <h1 className="text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
            hermez.
          </h1>
        </div>
        <nav className="flex items-center gap-8">
          <a
            href="#features"
            className="text-white/70 hover:text-white text-sm font-light transition-colors duration-300"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-white/70 hover:text-white text-sm font-light transition-colors duration-300"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            className="text-white/70 hover:text-white text-sm font-light transition-colors duration-300"
          >
            Pricing
          </a>
          <a
            href="https://github.com/DannylSyph3r/hermez"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-white/90 text-xs font-light hover:bg-white/15 hover:border-[#9F2B68]/60 transition-all duration-300"
          >
            <GithubIcon className="w-4 h-4" />
            <span>Star on GitHub</span>
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex-1 flex flex-col justify-center items-center px-6 pt-32 pb-24">
        <div className="max-w-5xl w-full text-center">
          {/* Subtitle */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#9F2B68] animate-pulse" />
            <span className="text-xs font-[family-name:var(--font-geist-mono)] text-white/60 tracking-wider uppercase">
              Now in Public Beta
            </span>
          </div>

          {/* Main Headline */}
          <h2 className="text-6xl xl:text-7xl font-light tracking-tight text-white mb-6 leading-[1.1]">
            Expose your local server{" "}
            <span className="font-[family-name:var(--font-playfair)] italic bg-gradient-to-r from-[#9F2B68] to-[#4E5180] bg-clip-text text-transparent">
              to the world
            </span>
          </h2>

          {/* Description */}
          <p className="text-white/50 text-lg font-light max-w-2xl mx-auto leading-relaxed mb-10">
            An open-source ngrok alternative that creates secure tunnels to your localhost. Share
            your development server, test webhooks, and demo your work—all in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <a
              href="/"
              className="group flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black text-sm font-medium hover:bg-gradient-to-r hover:from-[#9F2B68] hover:to-[#4E5180] hover:text-white transition-all duration-300"
            >
              Get Started Free
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
            <a
              href="https://github.com/DannylSyph3r/hermez"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/5 border border-white/20 text-white/90 text-sm font-medium hover:bg-white/10 hover:border-[#9F2B68]/60 transition-all duration-300"
            >
              <GithubIcon className="w-4 h-4" />
              View on GitHub
            </a>
          </div>

          {/* Terminal Preview */}
          <div className="max-w-xl mx-auto rounded-xl bg-black/40 border border-white/10 backdrop-blur-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
              <span className="w-3 h-3 rounded-full bg-[#9F2B68]/60" />
              <span className="w-3 h-3 rounded-full bg-[#4E5180]/60" />
              <span className="w-3 h-3 rounded-full bg-white/20" />
              <span className="ml-4 text-xs text-white/40 font-[family-name:var(--font-geist-mono)]">
                terminal
              </span>
            </div>
            <div className="p-6 font-[family-name:var(--font-geist-mono)] text-sm text-left">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[#9F2B68]">$</span>
                <span className="text-white/80">hermez http 3000</span>
              </div>
              <div className="text-white/40 text-xs space-y-1.5">
                <p>✓ Tunnel established</p>
                <p>✓ Secure connection active</p>
                <p className="mt-3">
                  <span className="text-white/60">Forwarding:</span>{" "}
                  <span className="text-[#4E5180]">https://abc123.hermez.dev</span>{" "}
                  <span className="text-white/30">→</span>{" "}
                  <span className="text-white/60">localhost:3000</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-[family-name:var(--font-geist-mono)] text-white/40 tracking-widest uppercase mb-3">
              Why Hermez?
            </p>
            <h3 className="text-4xl font-light tracking-tight text-white mb-4">
              Built for{" "}
              <span className="font-[family-name:var(--font-playfair)] italic">
                modern developers
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#9F2B68]/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9F2B68]/20 to-transparent flex items-center justify-center mb-6">
                <ZapIcon className="w-6 h-6 text-[#9F2B68]" />
              </div>
              <h4 className="text-xl font-medium text-white mb-3">Lightning Fast</h4>
              <p className="text-white/50 text-sm font-light leading-relaxed">
                Zero configuration required. Get a public URL for your local server in under 5
                seconds.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#9F2B68]/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4E5180]/20 to-transparent flex items-center justify-center mb-6">
                <ShieldIcon className="w-6 h-6 text-[#4E5180]" />
              </div>
              <h4 className="text-xl font-medium text-white mb-3">Secure by Default</h4>
              <p className="text-white/50 text-sm font-light leading-relaxed">
                End-to-end encryption with automatic HTTPS. Your traffic is always protected.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#9F2B68]/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6B2D5F]/20 to-transparent flex items-center justify-center mb-6">
                <GlobeIcon className="w-6 h-6 text-[#6B2D5F]" />
              </div>
              <h4 className="text-xl font-medium text-white mb-3">Custom Domains</h4>
              <p className="text-white/50 text-sm font-light leading-relaxed">
                Use your own custom domains for a professional appearance in demos and testing.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#9F2B68]/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9F2B68]/20 to-transparent flex items-center justify-center mb-6">
                <TerminalIcon className="w-6 h-6 text-[#9F2B68]" />
              </div>
              <h4 className="text-xl font-medium text-white mb-3">Request Inspector</h4>
              <p className="text-white/50 text-sm font-light leading-relaxed">
                Debug webhooks and API calls with real-time request inspection and replay.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#9F2B68]/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4E5180]/20 to-transparent flex items-center justify-center mb-6">
                <GithubIcon className="w-6 h-6 text-[#4E5180]" />
              </div>
              <h4 className="text-xl font-medium text-white mb-3">Open Source</h4>
              <p className="text-white/50 text-sm font-light leading-relaxed">
                Fully open source. Self-host on your own infrastructure or use our managed service.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#9F2B68]/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6B2D5F]/20 to-transparent flex items-center justify-center mb-6">
                <ZapIcon className="w-6 h-6 text-[#6B2D5F]" />
              </div>
              <h4 className="text-xl font-medium text-white mb-3">Enterprise Ready</h4>
              <p className="text-white/50 text-sm font-light leading-relaxed">
                Built for scale with team management, SSO, and enterprise-grade SLAs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/hermez-logo.png" alt="Hermez Logo" className="h-8 w-auto opacity-60" />
            <span className="text-white/40 text-sm font-light">© 2025 Hermez Inc.</span>
          </div>
          <p className="text-white/30 text-xs font-light italic font-[family-name:var(--font-geist-mono)]">
            As above, so below. As local, so global
          </p>
        </div>
      </footer>
    </div>
  );
}
