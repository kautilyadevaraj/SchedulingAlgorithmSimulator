// Type definition for Process
export type Process = {
  process_id: number;
  arrival_time: number;
  burst_time: number;
  priority: number;
  background: string;
};

type NativeAddon = {
  firstComeFirstServe: (processes: Process[]) => Process[];
  roundRobin: (processes: Process[], quantum: number) => Process[];
  shortestJobFirst: (processes: Process[]) => Process[];
  shortestRemainingTimeFirst: (processes: Process[]) => Process[];
  priorityNonPreemptive: (processes: Process[]) => Process[];
  priorityPreemptive: (processes: Process[]) => Process[];
};

// Try to load the native C++ addon, fall back to TypeScript implementations if not available.
let nativeAddon: NativeAddon | null = null;

if (typeof window === "undefined") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createRequire } = require("module") as {
      createRequire: (filename: string) => NodeRequire;
    };
    const nativeRequire = createRequire(__filename);
    nativeAddon = nativeRequire("../build/Release/scheduling_algorithms") as NativeAddon;
  } catch {
    console.warn("Native C++ addon not found. Using TypeScript implementations.");
  }
}

/**
 * Wrapper for First Come First Serve algorithm
 * Uses native C++ implementation if available, otherwise falls back to TypeScript
 */
export function firstComeFirstServe(processes: Process[]): Process[] {
  if (nativeAddon) {
    return nativeAddon.firstComeFirstServe(processes);
  }
  
  // TypeScript fallback implementation
  const sortedProcesses = [...processes].sort((a, b) => a.arrival_time - b.arrival_time);
  const result: Process[] = [];
  let currentTime = 0;

  for (let i = 0; i < sortedProcesses.length; i++) {
    const currentProcess = sortedProcesses[i];

    if (currentProcess.arrival_time > currentTime) {
      const gapDuration = currentProcess.arrival_time - currentTime;
      result.push({
        process_id: -1,
        arrival_time: -1,
        burst_time: gapDuration,
        priority: 0,
        background: "transparent",
      });
      currentTime = currentProcess.arrival_time;
    }

    result.push(currentProcess);
    currentTime += currentProcess.burst_time;
  }

  return result;
}

/**
 * Wrapper for Round Robin algorithm
 * Uses native C++ implementation if available, otherwise falls back to TypeScript
 */
export function roundRobin(processes: Process[], quantum: number): Process[] {
  if (nativeAddon) {
    return nativeAddon.roundRobin(processes, quantum);
  }

  // TypeScript fallback implementation
  const sortedProcesses = [...processes].sort(
    (a, b) => a.arrival_time - b.arrival_time
  );
  const result: Process[] = [];
  const queue: { process: Process; remaining_time: number }[] = [];
  let currentTime = 0;
  let index = 0;

  while (queue.length > 0 || index < sortedProcesses.length) {
    while (
      index < sortedProcesses.length &&
      sortedProcesses[index].arrival_time <= currentTime
    ) {
      queue.push({
        process: sortedProcesses[index],
        remaining_time: sortedProcesses[index].burst_time,
      });
      index++;
    }

    if (queue.length === 0) {
      const nextProcess = sortedProcesses[index];
      const gapDuration = nextProcess.arrival_time - currentTime;
      result.push({
        process_id: -1,
        arrival_time: -1,
        burst_time: gapDuration,
        priority: 0,
        background: "transparent",
      });
      currentTime += gapDuration;
    } else {
      const { process, remaining_time } = queue.shift()!;
      const executionTime = Math.min(remaining_time, quantum);

      result.push({
        ...process,
        arrival_time: currentTime,
        burst_time: executionTime,
      });

      currentTime += executionTime;

      while (
        index < sortedProcesses.length &&
        sortedProcesses[index].arrival_time <= currentTime
      ) {
        queue.push({
          process: sortedProcesses[index],
          remaining_time: sortedProcesses[index].burst_time,
        });
        index++;
      }

      if (remaining_time > quantum) {
        queue.push({
          process,
          remaining_time: remaining_time - quantum,
        });
      }
    }
  }

  const mergedResult: Process[] = [];
  for (let i = 0; i < result.length; i++) {
    const currentProcess = result[i];

    if (
      mergedResult.length > 0 &&
      mergedResult[mergedResult.length - 1].process_id ===
        currentProcess.process_id
    ) {
      mergedResult[mergedResult.length - 1].burst_time +=
        currentProcess.burst_time;
    } else {
      mergedResult.push(currentProcess);
    }
  }

  return mergedResult;
}

/**
 * Wrapper for Shortest Job First algorithm
 * Uses native C++ implementation if available, otherwise falls back to TypeScript
 */
export function shortestJobFirst(processes: Process[]): Process[] {
  if (nativeAddon) {
    return nativeAddon.shortestJobFirst(processes);
  }

  // TypeScript fallback implementation
  const sortedProcesses = [...processes].sort(
    (a, b) => a.arrival_time - b.arrival_time
  );

  const result: Process[] = [];
  const availableProcesses: Process[] = [];
  let currentTime = 0;
  let index = 0;

  while (index < sortedProcesses.length || availableProcesses.length > 0) {
    while (index < sortedProcesses.length && sortedProcesses[index].arrival_time <= currentTime) {
      availableProcesses.push(sortedProcesses[index]);
      index++;
    }

    if (availableProcesses.length > 0) {
      availableProcesses.sort((a, b) => a.burst_time - b.burst_time);
      const nextProcess = availableProcesses.shift()!;

      result.push({
        ...nextProcess,
        arrival_time: currentTime,
      });

      currentTime += nextProcess.burst_time;
    } else {
      const nextProcess = sortedProcesses[index];
      const gapDuration = nextProcess.arrival_time - currentTime;
      result.push({
        process_id: -1,
        arrival_time: -1,
        burst_time: gapDuration,
        priority: 0,
        background: "transparent",
      });
      currentTime += gapDuration;
    }
  }

  const mergedResult: Process[] = [];
  for (let i = 0; i < result.length; i++) {
    const currentProcess = result[i];

    if (
      mergedResult.length > 0 &&
      mergedResult[mergedResult.length - 1].process_id ===
        currentProcess.process_id
    ) {
      mergedResult[mergedResult.length - 1].burst_time +=
        currentProcess.burst_time;
    } else {
      mergedResult.push({ ...currentProcess });
    }
  }

  return mergedResult;
}

/**
 * Wrapper for Shortest Remaining Time First algorithm
 * Uses native C++ implementation if available, otherwise falls back to TypeScript
 */
export function shortestRemainingTimeFirst(processes: Process[]): Process[] {
  if (nativeAddon) {
    return nativeAddon.shortestRemainingTimeFirst(processes);
  }

  // TypeScript fallback implementation
  const sortedProcesses = [...processes].sort(
    (a, b) => a.arrival_time - b.arrival_time
  );
  const result: Process[] = [];
  const queue: { process: Process; remaining_time: number }[] = [];
  let currentTime = 0;
  let index = 0;

  while (queue.length > 0 || index < sortedProcesses.length) {
    while (
      index < sortedProcesses.length &&
      sortedProcesses[index].arrival_time <= currentTime
    ) {
      queue.push({
        process: sortedProcesses[index],
        remaining_time: sortedProcesses[index].burst_time,
      });
      index++;
    }

    queue.sort((a, b) => a.remaining_time - b.remaining_time);

    if (queue.length === 0) {
      const nextProcess = sortedProcesses[index];
      const gapDuration = nextProcess.arrival_time - currentTime;
      result.push({
        process_id: -1,
        arrival_time: -1,
        burst_time: gapDuration,
        priority: 0,
        background: "transparent",
      });
      currentTime += gapDuration;
    } else {
      const { process, remaining_time } = queue.shift()!;
      const executionTime = 1;

      result.push({
        ...process,
        arrival_time: currentTime,
        burst_time: executionTime,
      });

      currentTime += executionTime;

      while (
        index < sortedProcesses.length &&
        sortedProcesses[index].arrival_time <= currentTime
      ) {
        queue.push({
          process: sortedProcesses[index],
          remaining_time: sortedProcesses[index].burst_time,
        });
        index++;
      }

      if (remaining_time > executionTime) {
        queue.push({
          process,
          remaining_time: remaining_time - executionTime,
        });
      }
    }
  }

  const mergedResult: Process[] = [];
  for (let i = 0; i < result.length; i++) {
    const currentProcess = result[i];

    if (
      mergedResult.length > 0 &&
      mergedResult[mergedResult.length - 1].process_id ===
        currentProcess.process_id
    ) {
      mergedResult[mergedResult.length - 1].burst_time +=
        currentProcess.burst_time;
    } else {
      mergedResult.push({ ...currentProcess });
    }
  }

  return mergedResult;
}

/**
 * Wrapper for Priority Non-Preemptive algorithm
 * Uses native C++ implementation if available, otherwise falls back to TypeScript
 */
export function priorityNonPreemptive(processes: Process[]): Process[] {
  if (nativeAddon) {
    return nativeAddon.priorityNonPreemptive(processes);
  }

  // TypeScript fallback implementation
  const sortedProcesses = [...processes].sort((a, b) => a.arrival_time - b.arrival_time);
  const result: Process[] = [];
  const completed = new Array(sortedProcesses.length).fill(false);

  for (let i = 0; i < sortedProcesses.length; i++) {
    let nextProcess = -1;
    let highestPriority = Infinity;
    let currentTime = 0;

    // Calculate current time based on result
    for (const proc of result) {
      if (proc.process_id !== -1) {
        currentTime += proc.burst_time;
      }
    }

    // Find highest priority process that has arrived
    for (let j = 0; j < sortedProcesses.length; j++) {
      if (!completed[j] && sortedProcesses[j].arrival_time <= currentTime) {
        if (sortedProcesses[j].priority < highestPriority) {
          highestPriority = sortedProcesses[j].priority;
          nextProcess = j;
        }
      }
    }

    // If no process available, find next arrival
    if (nextProcess === -1) {
      for (let j = 0; j < sortedProcesses.length; j++) {
        if (!completed[j]) {
          const gapDuration = sortedProcesses[j].arrival_time - currentTime;
          if (gapDuration > 0) {
            result.push({
              process_id: -1,
              arrival_time: -1,
              burst_time: gapDuration,
              priority: 0,
              background: 'transparent',
            });
          }
          break;
        }
      }
      i = -1;
      continue;
    }

    // Execute the selected process
    const currentProcess = sortedProcesses[nextProcess];
    result.push(currentProcess);
    completed[nextProcess] = true;
  }

  return result;
}

/**
 * Wrapper for Priority Preemptive algorithm
 * Uses native C++ implementation if available, otherwise falls back to TypeScript
 */
export function priorityPreemptive(processes: Process[]): Process[] {
  if (nativeAddon) {
    return nativeAddon.priorityPreemptive(processes);
  }

  // TypeScript fallback implementation
  const sortedProcesses = [...processes].sort((a, b) => a.arrival_time - b.arrival_time);
  const result: Process[] = [];
  const remainingTime = sortedProcesses.map(p => p.burst_time);
  let currentTime = 0;
  let completedCount = 0;

  while (completedCount < sortedProcesses.length) {
    let nextProcess = -1;
    let highestPriority = Infinity;

    // Find highest priority process that has arrived and has remaining time
    for (let i = 0; i < sortedProcesses.length; i++) {
      if (remainingTime[i] > 0 && sortedProcesses[i].arrival_time <= currentTime) {
        if (sortedProcesses[i].priority < highestPriority) {
          highestPriority = sortedProcesses[i].priority;
          nextProcess = i;
        }
      }
    }

    // If no process available, jump to next arrival
    if (nextProcess === -1) {
      let nextArrival = Infinity;
      for (let i = 0; i < sortedProcesses.length; i++) {
        if (remainingTime[i] > 0 && sortedProcesses[i].arrival_time > currentTime) {
          nextArrival = Math.min(nextArrival, sortedProcesses[i].arrival_time);
        }
      }

      if (nextArrival !== Infinity) {
        const gapDuration = nextArrival - currentTime;
        result.push({
          process_id: -1,
          arrival_time: -1,
          burst_time: gapDuration,
          priority: 0,
          background: 'transparent',
        });
        currentTime = nextArrival;
      }
      continue;
    }

    // Execute for 1 time unit
    const currentProcess = sortedProcesses[nextProcess];
    result.push({
      ...currentProcess,
      arrival_time: currentTime,
      burst_time: 1,
    });

    remainingTime[nextProcess]--;
    currentTime++;

    if (remainingTime[nextProcess] === 0) {
      completedCount++;
    }
  }

  return result;
}
