"use client";

import React, { useCallback, useRef } from "react";
import { useStore } from "@/store/useStore";

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  ReactFlowInstance,
  Connection,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";

import "reactflow/dist/style.css";

import TextNode from "./nodes/TextNode";
import ImageNode from "./nodes/ImageNode";
import VideoNode from "./nodes/VideoNode";
import LLMNode from "./nodes/LLMNode";
import CropNode from "./nodes/CropNode";
import ExtractNode from "./nodes/ExtractNode";

// ✅ Node types (correct)
const nodeTypes = {
  text: TextNode,
  image: ImageNode,
  video: VideoNode,
  llm: LLMNode,
  crop: CropNode,
  extract: ExtractNode,
};

let id = 0;
const getId = () => `node_${id++}`;

export default function Canvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  const { nodes, edges, setNodes, setEdges } = useStore();

  // 🔗 CONNECT EDGES
  const onConnect = useCallback(
    (params: Connection | Edge) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: "#8b5cf6", strokeWidth: 2 },
          },
          eds,
        ),
      );
    },
    [setEdges],
  );

  // 📦 DROP NODE
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const bounds = reactFlowWrapper.current?.getBoundingClientRect();

      const position = reactFlowInstance.current?.project({
        x: event.clientX - (bounds?.left || 0),
        y: event.clientY - (bounds?.top || 0),
      });

      const newNode = {
        id: getId(),
        type,
        position: position || { x: 250, y: 150 },
        data: {},
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes],
  );

  return (
    <div ref={reactFlowWrapper} className="w-full h-full bg-[#0b0b14]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onInit={(instance) => (reactFlowInstance.current = instance)}
        onConnect={onConnect}
        onNodesChange={(changes) =>
          setNodes((nds) => applyNodeChanges(changes, nds))
        }
        onEdgesChange={(changes) =>
          setEdges((eds) => applyEdgeChanges(changes, eds))
        }
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        {/* 🔥 GRID BACKGROUND */}
        <Background gap={20} size={1} color="#1f1f2f" />

        {/* 🎛 CONTROLS */}
        <Controls
          style={{
            background: "#1a1a2e",
            border: "none",
          }}
        />

        {/* 🗺 MINIMAP */}
        <MiniMap nodeColor="#8b5cf6" maskColor="rgba(0,0,0,0.6)" />
      </ReactFlow>
    </div>
  );
}
