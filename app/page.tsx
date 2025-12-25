import TunnelBackground from "@/src/components/tunnel/TunnelBackground";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden font-[family-name:var(--font-geist-sans)] text-white">
      {/* Background (Z-0) */}
      <TunnelBackground />

      {/* Content Overlay (Z-10) */}
      <div className="relative z-10 flex flex-col items-center gap-8 p-8 text-center max-w-2xl">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
          hermez.
        </h1>

        <p className="text-xl md:text-2xl text-white/70 font-[family-name:var(--font-geist-mono)]">
          Tunneling to the future.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-8">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm transition-all text-white placeholder:text-white/30"
          />
          <button className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition-colors">
            Join Waitlist
          </button>
        </div>
      </div>

      <footer className="absolute bottom-8 text-xs text-white/30 font-[family-name:var(--font-geist-mono)]">
        &copy; 2025 Hermez Inc.
      </footer>
    </div>
  );
}

