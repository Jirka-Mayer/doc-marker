/**
 * An awaitable variant of the setTimeout function.
 * Usage: await timeoutAsync(500);
 */
export function timeoutAsync(delay?: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
