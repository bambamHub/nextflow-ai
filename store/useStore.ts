import { create } from "zustand";
import { Node, Edge } from "reactflow";

interface State {
  nodes: Node[];
  edges: Edge[];
  nodeStatus: Record<string, string>;

  setNodes: (payload: Node[] | ((nodes: Node[]) => Node[])) => void;
  setEdges: (payload: Edge[] | ((edges: Edge[]) => Edge[])) => void;
  setNodeStatus: (id: string, status: string) => void;
}

export const useStore = create<State>((set) => ({
  nodes: [],
  edges: [],
  nodeStatus: {},

  // ✅ FIXED
  setNodes: (payload) =>
    set((state) => ({
      nodes:
        typeof payload === "function"
          ? payload(state.nodes)
          : payload,
    })),

  // ✅ FIXED
  setEdges: (payload) =>
    set((state) => ({
      edges:
        typeof payload === "function"
          ? payload(state.edges)
          : payload,
    })),

  setNodeStatus: (id, status) =>
    set((state) => ({
      nodeStatus: { ...state.nodeStatus, [id]: status },
    })),
}));