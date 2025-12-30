"use client";

import { useState } from "react";
import TunnelBackground from "@/src/components/tunnel/TunnelBackground";
import { GithubIcon, ZapIcon, ShieldIcon, SearchIcon, GlobeIcon, CodeIcon } from "lucide-react";
import { subscribeToWaitlist } from "@/lib/api/waitlist";
import { isValidEmail } from "@/lib/utils";
import { toast } from "sonner";

const features = [
  { icon: ZapIcon, title: "Instant Setup", desc: "Live in seconds." },
  { icon: ShieldIcon, title: "Encrypted", desc: "End-to-end HTTPS tunnels." },
  { icon: SearchIcon, title: "Inspection", desc: "Real-time request replay." },
  { icon: GlobeIcon, title: "Custom Domains", desc: "Use your own domains." },
  { icon: CodeIcon, title: "Enterprise-Ready", desc: "Rock-solid reliability." },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWaitlistSubmit = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    // Track start time for minimum delay
    const startTime = Date.now();
    const MIN_DELAY_MS = 1500;

    try {
      const response = await subscribeToWaitlist(email);

      // Ensure minimum delay for visual feedback
      const elapsed = Date.now() - startTime;
      if (elapsed < MIN_DELAY_MS) {
        await new Promise((resolve) => setTimeout(resolve, MIN_DELAY_MS - elapsed));
      }

      if (response.successful) {
        toast.success("Delivered to Olympus. Await your invitation.");
        setEmail("");
      } else {
        toast.error(response.message || "Failed to join waitlist");
      }
    } catch (error: any) {
      // Ensure minimum delay even on error
      const elapsed = Date.now() - startTime;
      if (elapsed < MIN_DELAY_MS) {
        await new Promise((resolve) => setTimeout(resolve, MIN_DELAY_MS - elapsed));
      }

      const errorMessage = error.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleWaitlistSubmit();
    }
  };

  return (
    <div className="relative min-h-screen md:min-w-[900px] flex flex-col overflow-auto font-[family-name:var(--font-geist-sans)] text-white">
      <TunnelBackground />

      {/* Page Header */}
      <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-0">
          <img src="/hermez-logo.png" alt="Hermez Logo" className="h-8 md:h-12 w-auto" />
          <h1 className="text-lg md:text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
            hermez.
          </h1>
        </div>
        <a
          href="https://github.com/DannylSyph3r/hermez"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-white/90 text-[10px] md:text-xs font-light font-[family-name:var(--font-geist-sans)] hover:bg-white/15 hover:border-[#9F2B68]/60 transition-all duration-300"
        >
          <GithubIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span>Star on GitHub</span>
        </a>
      </header>

      {/* Main Body*/}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 md:px-6 pt-14 md:pt-16">
        <div className="max-w-4xl w-full text-center">
          <p className="text-xs md:text-base lg:text-lg text-white/40 font-[family-name:var(--font-geist-mono)] font-light tracking-widest uppercase mb-2 md:mb-3">
            Tunneling to the future
          </p>

          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight text-white mb-2 md:mb-4 leading-[1.1] md:whitespace-nowrap">
            Bridge worlds at{" "}
            <span className="font-[family-name:var(--font-playfair)] italic">divine speed</span>
          </h2>

          <p className="text-white/50 text-sm md:text-base lg:text-lg font-light max-w-2xl mx-auto leading-relaxed mb-4 md:mb-6 px-2 md:px-0">
            An open-source ngrok alternative built for developers who need fast, reliable tunnels.
            Share your local server with anyone, anywhere.
          </p>

          {/* Waitlist Field and Button */}
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full max-w-md mx-auto mb-4 md:mb-6 px-6 md:px-0">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 md:py-3 rounded-full bg-white/5 border border-[#4E5180]/50 focus:outline-none focus:border-[#9F2B68]/70 backdrop-blur-sm transition-all text-white placeholder:text-white/30 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleWaitlistSubmit}
              disabled={isSubmitting}
              className="px-5 md:px-6 py-2.5 md:py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-gradient-to-r hover:from-[#9F2B68] hover:to-[#4E5180] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Joining..." : "Join Waitlist"}
            </button>
          </div>

          {/* Mock Command*/}
          <code className="inline-block px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-white/5 border border-white/10 font-[family-name:var(--font-geist-mono)] text-xs md:text-sm mb-4 md:mb-6">
            <span className="text-[#9F2B68] font-bold">hermez</span>{" "}
            <span className="text-white/50">http 3000</span>
          </code>

          {/* Features Strip - Horizontal scroll on mobile */}
          <div className="w-full md:w-auto overflow-x-auto md:overflow-visible scrollbar-hide scroll-smooth snap-x snap-mandatory md:snap-none pb-2 md:pb-0">
            <div className="flex md:flex-wrap md:justify-center items-start gap-x-6 md:gap-x-8 gap-y-3 w-max md:w-auto px-4 md:px-0">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 group snap-center flex-shrink-0"
                >
                  <span className="text-[#6B2D5F] group-hover:text-[#9F2B68] transition-colors">
                    <feature.icon className="w-4 h-4 md:w-6 md:h-6" />
                  </span>
                  <div className="text-left">
                    <span className="text-white/80 text-[10px] md:text-xs font-medium">
                      {feature.title}
                    </span>
                    <span className="text-white/40 text-[10px] md:text-xs font-light ml-1">
                      {feature.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-1 pb-4 px-4 md:px-6 text-center mt-auto">
        <p className="text-white/30 text-[10px] md:text-xs font-light italic mb-1">
          As above, so below. As local, so global
        </p>
        <p className="text-white/20 text-[8px] md:text-[10px] font-[family-name:var(--font-geist-mono)]">
          © 2025 Hermez Inc.
        </p>
      </footer>
    </div>
  );
}
