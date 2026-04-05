export async function triggerTask(nodeId: string, fn: () => Promise<any>) {
  try {
    const result = await fn();
    return { status: "success", result };
  } catch (error) {
    return { status: "failed", error };
  }
}