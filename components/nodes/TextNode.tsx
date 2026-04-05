"use client";

import { useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import BaseNode from "./BaseNode";
import { useStore } from "@/store/useStore";

export default function TextNode({ data, id }: any) {
  const [text, setText] = useState(data.text || "");

  const { setNodes, nodeStatus } = useStore();

  // ✅ Proper sync with Zustand (NO direct mutation)
  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: { ...node.data, text },
            }
          : node,
      ),
    );
  }, [text, id, setNodes]);

  // 🔥 Node execution status
  const status = nodeStatus?.[id];

  return (
    <div
      className={`
        node
        ${status === "running" ? "node-running" : ""}
        ${status === "success" ? "node-success" : ""}
        ${status === "failed" ? "node-error" : ""}
      `}
    >
      {/* 🔹 INPUT HANDLE */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#8b5cf6" }}
      />

      {/* 🔹 NODE BODY */}
      <BaseNode id={id} title="Text Node" outputs={["text"]}>
        <textarea
          className="
            w-full p-2 rounded-md 
            bg-transparent text-white text-sm
            border border-gray-700
            focus:border-purple-500 focus:outline-none
          "
          placeholder="Enter text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </BaseNode>

      {/* 🔹 OUTPUT HANDLE */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#8b5cf6" }}
      />
    </div>
  );
}
