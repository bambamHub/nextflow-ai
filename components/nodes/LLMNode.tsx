"use client";

import { useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import BaseNode from "./BaseNode";
import { useStore } from "@/store/useStore";

export default function LLMNode({ data, id }: any) {
  const [system, setSystem] = useState(data.systemPrompt || "");
  const [user, setUser] = useState(data.userPrompt || "");

  const { setNodes, nodeStatus } = useStore();

  // ✅ Proper state sync (NO mutation)
  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                systemPrompt: system,
                userPrompt: user,
              },
            }
          : node,
      ),
    );
  }, [system, user, id, setNodes]);

  // 🔥 Execution status
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
      {/* 🔹 INPUT HANDLES */}
      <Handle
        type="target"
        position={Position.Left}
        id="system_prompt"
        style={{ top: "30%", background: "#8b5cf6" }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="user_message"
        style={{ top: "60%", background: "#8b5cf6" }}
      />

      {/* 🔹 OUTPUT HANDLE */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{ background: "#8b5cf6" }}
      />

      {/* 🔹 NODE BODY */}
      <BaseNode
        id={id}
        title="LLM Node"
        inputs={["system_prompt", "user_message", "images"]}
        outputs={["output"]}
      >
        {/* SYSTEM PROMPT */}
        <textarea
          className="
            w-full p-2 rounded-md mb-2
            bg-transparent text-white text-xs
            border border-gray-700
            focus:border-purple-500 focus:outline-none
          "
          placeholder="System prompt..."
          value={system}
          onChange={(e) => setSystem(e.target.value)}
        />

        {/* USER PROMPT */}
        <textarea
          className="
            w-full p-2 rounded-md
            bg-transparent text-white text-xs
            border border-gray-700
            focus:border-purple-500 focus:outline-none
          "
          placeholder="User prompt..."
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
      </BaseNode>
    </div>
  );
}
