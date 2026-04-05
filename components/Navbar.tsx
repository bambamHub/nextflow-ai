"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { Play, Save, Upload, Download } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function Navbar() {
  const { nodes, edges, setNodes, setEdges } = useStore();

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // 🚀 RUN FLOW
  const handleRun = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/run", {
        method: "POST",
        body: JSON.stringify({ nodes, edges }),
      });

      const data = await res.json();
      console.log("RUN RESULT:", data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 💾 SAVE
  const handleSave = async () => {
    await fetch("/api/workflow", {
      method: "POST",
      body: JSON.stringify({ nodes, edges }),
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // 📤 EXPORT
  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ nodes, edges })], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "workflow.json";
    a.click();
  };

  // 📥 IMPORT (FIXED)
  const handleImport = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event: any) => {
      const data = JSON.parse(event.target.result);
      setNodes(data.nodes || []);
      setEdges(data.edges || []);
    };

    reader.readAsText(file);
  };

  return (
    <div
      className="h-14 px-6 flex items-center justify-between 
      bg-[#0b0b14]/80 backdrop-blur-xl 
      border-b border-gray-800"
    >
      {/* LEFT */}
      <h1 className="text-lg font-semibold text-purple-400 tracking-tight">
        ⚡ NextFlow
      </h1>

      {/* CENTER ACTIONS */}
      <div className="flex items-center gap-3">
        {/* RUN */}
        <button
          onClick={handleRun}
          className={`btn-primary relative ${
            loading ? "opacity-80 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <Play size={14} />
          )}
          {loading ? "Running..." : "Run"}
        </button>

        {/* SAVE */}
        <button onClick={handleSave} className="btn-secondary relative">
          <Save size={14} />
          {saved ? "Saved ✅" : "Save"}
        </button>

        {/* EXPORT */}
        <button onClick={handleExport} className="btn-secondary">
          <Download size={14} />
          Export
        </button>

        {/* IMPORT */}
        <label className="btn-secondary cursor-pointer">
          <Upload size={14} />
          Import
          <input type="file" hidden onChange={handleImport} />
        </label>
      </div>

      {/* RIGHT USER */}
      <div className="flex items-center gap-3">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}
