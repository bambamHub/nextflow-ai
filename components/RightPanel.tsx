"use client";

import { useEffect, useState } from "react";
import { Clock, CheckCircle, XCircle, Loader2, Copy } from "lucide-react";

export default function RightPanel() {
  const [history, setHistory] = useState<any[]>([]);
  const [selectedRun, setSelectedRun] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/history");

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // 🎨 STATUS UI
  const getStatusUI = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return {
          icon: <CheckCircle size={14} />,
          className: "text-green-400",
          glow: "shadow-green-500/20",
        };
      case "FAILED":
        return {
          icon: <XCircle size={14} />,
          className: "text-red-400",
          glow: "shadow-red-500/20",
        };
      default:
        return {
          icon: <Loader2 size={14} className="animate-spin" />,
          className: "text-yellow-400",
          glow: "shadow-yellow-500/20",
        };
    }
  };

  const handleCopy = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  return (
    <div className="h-full flex flex-col bg-[#0b0b14]/80 backdrop-blur-xl border-l border-gray-800">
      {/* HEADER */}
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-purple-400 tracking-wide">
          📊 History
        </h2>

        <button
          onClick={fetchHistory}
          className="text-xs px-3 py-1 rounded-lg bg-[#1a1a2e] hover:bg-[#222244]"
        >
          Refresh
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center items-center py-6 text-gray-400">
          <Loader2 className="animate-spin mr-2" size={16} />
          Loading...
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="text-red-400 text-sm text-center py-4">{error}</div>
      )}

      {/* RUN LIST */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {!loading && history.length === 0 && !error && (
          <div className="text-gray-500 text-sm text-center mt-10">
            No runs yet 🚀
          </div>
        )}

        {history.map((run) => {
          const statusUI = getStatusUI(run.status);

          return (
            <div
              key={run.id}
              onClick={() => setSelectedRun(run)}
              className={`
                p-3 rounded-xl border cursor-pointer 
                transition-all duration-200

                ${
                  selectedRun?.id === run.id
                    ? "border-purple-500 bg-[#1a1a2e] shadow-lg shadow-purple-500/10"
                    : "border-gray-800 bg-[#141424] hover:bg-[#1f1f2f]"
                }
              `}
            >
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-white">
                  Run #{run.id?.slice(-4)}
                </p>

                <span
                  className={`flex items-center gap-1 text-xs ${statusUI.className}`}
                >
                  {statusUI.icon}
                  {run.status}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                <Clock size={12} />
                {run.createdAt ? new Date(run.createdAt).toLocaleString() : "—"}
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAILS PANEL */}
      {selectedRun && (
        <div className="border-t border-gray-800 p-4 bg-[#0d0d18] max-h-80 overflow-y-auto">
          <h3 className="text-sm font-semibold text-purple-400 mb-3">
            Run Details
          </h3>

          {selectedRun.nodeResults ? (
            Object.entries(selectedRun.nodeResults).map(
              ([nodeId, result]: any) => (
                <div
                  key={nodeId}
                  className="bg-[#1a1a2e] p-3 rounded-xl border border-gray-700 mb-3"
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-purple-400 font-medium">
                      {nodeId}
                    </p>

                    <button
                      onClick={() => handleCopy(result)}
                      className="p-1 rounded hover:bg-white/10"
                    >
                      <Copy size={14} />
                    </button>
                  </div>

                  <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              ),
            )
          ) : (
            <p className="text-gray-500 text-xs">
              No node-level data available
            </p>
          )}
        </div>
      )}
    </div>
  );
}
