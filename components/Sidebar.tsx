"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Settings,
  Image,
  Video,
  Type,
  Sparkles,
  Crop,
  Scissors,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { UserButton } from "@clerk/nextjs";
import { useStore } from "@/store/useStore";

const nodeItems = [
  { type: "text", label: "Text", icon: Type },
  { type: "image", label: "Upload Image", icon: Image },
  { type: "video", label: "Upload Video", icon: Video },
  { type: "llm", label: "LLM", icon: Sparkles },
  { type: "crop", label: "Crop Image", icon: Crop },
  { type: "extract", label: "Extract Frame", icon: Scissors },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const { setNodes, setEdges } = useStore();

  const onDragStart = (event: any, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleNewWorkflow = () => {
    setNodes([]);
    setEdges([]);
  };

  return (
    <div
      className={`
        h-full flex flex-col shrink-0 
        bg-[#0b0b14]/80 backdrop-blur-xl 
        border-r border-gray-800
        transition-all duration-300
        ${collapsed ? "w-16" : "w-64"}
      `}
    >
      {/* TOP BRAND */}
      <div className="flex items-center justify-between p-3 border-b border-gray-800">
        {!collapsed && (
          <h1 className="text-sm font-semibold text-purple-400"> Workspace</h1>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hover:bg-white/5 p-1 rounded-md"
        >
          {collapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
      </div>

      {/* ACTIONS */}
      <div className="p-2 space-y-1">
        <SidebarItem
          icon={Plus}
          label="New"
          onClick={handleNewWorkflow}
          collapsed={collapsed}
        />
        <SidebarItem icon={Search} label="Search" collapsed={collapsed} />
        <SidebarItem icon={Settings} label="Settings" collapsed={collapsed} />
      </div>

      <div className="border-t border-gray-800 my-2" />

      {/* NODES */}
      <div className="flex-1 overflow-y-auto px-2">
        {!collapsed && (
          <p className="text-xs text-gray-500 px-2 mb-2 uppercase tracking-wider">
            Nodes
          </p>
        )}

        {nodeItems.map((node) => {
          const Icon = node.icon;

          return (
            <div
              key={node.type}
              draggable
              onClick={() => setActive(node.type)}
              onDragStart={(e) => onDragStart(e, node.type)}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-xl mb-1 
                cursor-grab active:cursor-grabbing
                transition-all duration-200

                ${
                  active === node.type
                    ? "bg-purple-600/20 border border-purple-500 shadow-md shadow-purple-500/20"
                    : "hover:bg-purple-600/10 hover:border hover:border-purple-500/30"
                }
              `}
            >
              <Icon
                size={18}
                className="text-purple-400 group-hover:scale-110 transition-transform"
              />

              {!collapsed && (
                <span className="text-sm text-gray-300">{node.label}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ACTION ITEM */
function SidebarItem({ icon: Icon, label, collapsed, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="
        flex items-center gap-3 px-3 py-2 rounded-xl 
        hover:bg-[#1a1a2e] 
        cursor-pointer
        transition-all duration-200
      "
    >
      <Icon size={18} className="text-gray-400" />

      {!collapsed && <span className="text-sm text-gray-300">{label}</span>}
    </div>
  );
}
