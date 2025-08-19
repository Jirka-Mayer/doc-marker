/**
 * Semaphore synchronization primitive for async code
 */
export class SemaphoreAsync {
  /**
   * How many users can acquire the lock simultaneously at most
   */
  public readonly maxParallelism: number;

  /**
   * How many users have acquired the lock currently
   */
  private currentParallelism: number = 0;

  /**
   * Queue of waiting users, tuples of their promise and its resolver function
   */
  private waitingUsers: [Promise<void>, () => void][] = [];

  constructor(maxParallelism: number) {
    this.maxParallelism = maxParallelism;
  }

  /**
   * Try acquiring the lock and if occupied, asynchronously wait for acquisition
   */
  public async acquire(): Promise<void> {
    // the semaphore is full, we need to wait
    while (this.currentParallelism >= this.maxParallelism) {
      await this.standTheQueue();
    }

    // acquire the lock
    this.currentParallelism += 1;
  }

  private async standTheQueue(): Promise<void> {
    // construct the promise
    let resolver: (() => void) | null = null;
    const promise = new Promise<void>((resolve, reject) => {
      resolver = resolve;
    });
    if (resolver === null) {
      throw new Error("Promise executer has not run yet. Should not happen.");
    }

    // enter the queue
    this.waitingUsers.push([promise, resolver]);

    // wait
    await promise;
  }

  /**
   * Release the lock
   * (calling release without acquisition breaks the lock)
   */
  public release() {
    if (this.currentParallelism <= 0) {
      throw new Error("Releasing lock, but the lock is not acquired once.");
    }

    // release the lock
    this.currentParallelism -= 1;

    // wake up someone from the queue
    if (this.waitingUsers.length > 0) {
      const [promise, resolver] = this.waitingUsers.splice(0, 1)[0]; // dequeue
      resolver(); // wake up
    }
  }

  /**
   * Wraps the acquisition and release in a single function with the
   * critical section given as an async lambda function.
   */
  public async criticalSection(body: () => Promise<void>): Promise<void> {
    try {
      await this.acquire();
      await body();
    } finally {
      this.release();
    }
  }
}
