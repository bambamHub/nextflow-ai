import { executeNode } from "./executor";
import { triggerTask } from "./trigger";
import { useStore } from "@/store/useStore";

export function buildGraph(nodes: any[], edges: any[]) {
  const graph: Record<string, string[]> = {};
  const indegree: Record<string, number> = {};

  nodes.forEach((node) => {
    graph[node.id] = [];
    indegree[node.id] = 0;
  });

  edges.forEach((edge) => {
    graph[edge.source].push(edge.target);
    indegree[edge.target]++;
  });

  return { graph, indegree };
}

// ✅ Cycle Detection
export function hasCycle(nodes: any[], edges: any[]) {
  const { graph, indegree } = buildGraph(nodes, edges);

  const queue: string[] = [];

  Object.keys(indegree).forEach((node) => {
    if (indegree[node] === 0) queue.push(node);
  });

  let visited = 0;

  while (queue.length) {
    const node = queue.shift()!;
    visited++;

    graph[node].forEach((neighbor) => {
      indegree[neighbor]--;
      if (indegree[neighbor] === 0) queue.push(neighbor);
    });
  }

  return visited !== nodes.length;
}

// ✅ Input collection
export function collectInputs(nodeId: string, edges: any[], results: any) {
  const inputs: Record<string, any> = {};

  edges.forEach((edge) => {
    if (edge.target === nodeId) {
      const value = results[edge.source];

      if (!value) return;

      const key = edge.targetHandle || "input";

      // 🔥 smart mapping
      if (key === "system_prompt") inputs.system_prompt = value;
      else if (key === "user_message") inputs.user_message = value;
      else if (key === "images") inputs.images = value;
      else inputs[key] = value;
    }
  });

  return inputs;
}






export async function executeWorkflow(nodes: any[], edges: any[]) {
  const { graph, indegree } = buildGraph(nodes, edges);

  const results: Record<string, any> = {};
  const queue: string[] = [];

  const { setNodeStatus } = useStore.getState();

  Object.keys(indegree).forEach((node) => {
    if (indegree[node] === 0) queue.push(node);
  });

  while (queue.length) {
    const batch = [...queue];
    queue.length = 0;

    await Promise.all(
      batch.map(async (nodeId) => {
        const node = nodes.find((n) => n.id === nodeId);

        // 🔥 mark running
        setNodeStatus(nodeId, "running");

        const inputData = collectInputs(nodeId, edges, results);

        const { status, result } = await triggerTask(nodeId, async () =>
          executeNode(node, inputData)
        );

        if (status === "success") {
          results[nodeId] = result;
          setNodeStatus(nodeId, "success");
        } else {
          setNodeStatus(nodeId, "failed");
        }

        graph[nodeId].forEach((neighbor) => {
          indegree[neighbor]--;

          if (indegree[neighbor] === 0) {
            queue.push(neighbor);
          }
        });
      })
    );
  }

  return results;
}