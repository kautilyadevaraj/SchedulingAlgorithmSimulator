// Try to load the native C++ addon, fall back to TypeScript implementations if not available
let nativeAddon: any = null;

try {
  nativeAddon = require('../build/Release/scheduling_algorithms');
} catch (err) {
  console.warn('Native C++ addon not found. Using TypeScript implementations.');
  // The TypeScript implementations will be used via import fallback
}

// Type definition for Process
export type Process = {
  process_id: number;
  arrival_time: number;
  burst_time: number;
  background: string;
};

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
