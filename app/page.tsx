"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Canvas from "@/components/Canvas";
import RightPanel from "@/components/RightPanel";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* 🔝 TOP NAVBAR */}
      <Navbar />

      {/* 🔥 MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <Sidebar />

        {/* CENTER CANVAS */}
        <div className="flex-1 h-full bg-[#0b0b14]">
          <Canvas />
        </div>

        {/* RIGHT PANEL */}
        <RightPanel />
      </div>
    </div>
  );
}
