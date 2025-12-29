"use client";

import { Toaster as Sonner } from "sonner";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      position="top-center"
      className="toaster group"
      icons={{
        success: <CheckCircle className="h-5 w-5 text-green-500" />,
        error: <XCircle className="h-5 w-5 text-red-500" />,
        warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        info: <Info className="h-5 w-5 text-gray-400" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-black/80 group-[.toaster]:text-white group-[.toaster]:border group-[.toaster]:border-[var(--hermez-secondary)]/30 group-[.toaster]:shadow-lg group-[.toaster]:shadow-[var(--hermez-primary)]/5 group-[.toaster]:backdrop-blur-md group-[.toaster]:rounded-xl group-[.toaster]:!px-5 group-[.toaster]:!py-3",
          description: "group-[.toast]:text-white/60",
          actionButton:
            "group-[.toast]:bg-[var(--hermez-primary)] group-[.toast]:text-white group-[.toast]:rounded-lg",
          cancelButton:
            "group-[.toast]:bg-white/10 group-[.toast]:text-white group-[.toast]:rounded-lg",
          error:
            "group-[.toaster]:!border-red-500/30",
          success:
            "group-[.toaster]:!border-green-500/30",
          warning:
            "group-[.toaster]:!border-yellow-500/30",
          info:
            "group-[.toaster]:!border-gray-500/30",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };