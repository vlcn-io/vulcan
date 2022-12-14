import { MemoryVersion } from "./memory.js";
import { inflight, Transaction } from "./transaction.js";

type Node<T> = {
  memVers: MemoryVersion;
  data: T;
};

export class History<T> {
  // most recent things are at the end
  private nodes: Node<T>[] = [];

  at(memVers: MemoryVersion): T {
    for (let i = this.nodes.length - 1; i > -1; --i) {
      const node = this.nodes[i];
      if (node.memVers <= memVers) {
        return node.data;
      }
    }

    throw new Error("Could not find any data for version " + memVers);
  }

  maybeAdd(data: T, memoryVersion: MemoryVersion): void {
    if (inflight.length === 0) {
      this.drop();
      // if no tx is in flight we have no need to record history of values.
      // history of values is only retained for tx isolation.
      return;
    }

    // still inflight txs but our history is at a certain limit
    if (this.nodes.length > 3) {
      this.#maybeDrop(memoryVersion);
    }

    this.nodes.push({
      memVers: memoryVersion,
      data,
    });
  }

  public drop() {
    if (this.nodes.length > 0) {
      this.nodes = [];
    }
  }

  #maybeDrop(memoryVersion: MemoryVersion) {
    // TODO
    // based on min memory version of inflight transactions
    // We can drop all history entries except for the one before the one greater than the smallest inflight mem version.
  }
}
