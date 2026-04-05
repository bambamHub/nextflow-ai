"use client";

import { useStore } from "@/store/useStore";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function BaseNode({ id, title, children }: any) {
  const { nodeStatus } = useStore();

  const status = nodeStatus?.[id];

  // 🎨 STATUS STYLES
  const statusStyles = {
    running: {
      border: "border-purple-500",
      glow: "shadow-purple-500/30",
      icon: <Loader2 size={12} className="animate-spin" />,
    },
    success: {
      border: "border-green-500",
      glow: "shadow-green-500/30",
      icon: <CheckCircle size={12} />,
    },
    failed: {
      border: "border-red-500",
      glow: "shadow-red-500/30",
      icon: <XCircle size={12} />,
    },
  };

  const current = status ? statusStyles[status] : null;

  return (
    <div
      className={`
        relative w-64 rounded-2xl p-3
        bg-gradient-to-br from-[#141424] to-[#1a1a2e]
        border ${current?.border || "border-gray-700"}
        shadow-lg ${current?.glow || ""}
        transition-all duration-200
        hover:shadow-xl hover:scale-[1.02]
      `}
    >
      {/* 🔹 TITLE */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-purple-400 tracking-wide">
          {title}
        </span>

        {/* STATUS */}
        {status && (
          <div className="flex items-center gap-1 text-[10px] text-gray-300 bg-black/40 px-2 py-[2px] rounded-md border border-gray-600">
            {current?.icon}
            {status}
          </div>
        )}
      </div>

      {/* 🔹 CONTENT */}
      <div className="space-y-2">{children}</div>
    </div>
  );
}
