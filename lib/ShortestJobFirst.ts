// ShortestJobFirst.ts

/**
 * Define the Process type
 */
export type Process = {
  process_id: number;
  arrival_time: number;
  burst_time: number;
  background: string;
};

export type ScheduledProcess = Process & {
  startTime: number;
  endTime: number;
  waitingTime: number;
  turnaroundTime: number;
};

export type SimulationResult = {
  sequence: Process[]; // For Gantt Chart (includes idle time with process_id -1)
  stats: {
    avgWaitingTime: number;
    avgTurnaroundTime: number;
    cpuUtilization: number;
    throughput: number;
  };
  processStats: ScheduledProcess[];
};

/**
 * Applies the Shortest Job First (SJF) non-preemptive scheduling algorithm.
 */
export function shortestJobFirst(processes: Process[]): SimulationResult {
  const sortedByArrival = [...processes].sort((a, b) => {
    if (a.arrival_time !== b.arrival_time) return a.arrival_time - b.arrival_time;
    return a.process_id - b.process_id;
  });

  const sequence: Process[] = [];
  const processStats: ScheduledProcess[] = [];
  const readyQueue: Process[] = [];
  let currentTime = 0;
  let index = 0;
  const totalBurstTime = processes.reduce((sum, p) => sum + p.burst_time, 0);

  while (index < sortedByArrival.length || readyQueue.length > 0) {
    while (index < sortedByArrival.length && sortedByArrival[index].arrival_time <= currentTime) {
      readyQueue.push(sortedByArrival[index]);
      index++;
    }

    if (readyQueue.length > 0) {
      readyQueue.sort((a, b) => {
        if (a.burst_time !== b.burst_time) return a.burst_time - b.burst_time;
        if (a.arrival_time !== b.arrival_time) return a.arrival_time - b.arrival_time;
        return a.process_id - b.process_id;
      });

      const next = readyQueue.shift()!;
      const startTime = currentTime;
      const waitingTime = startTime - next.arrival_time;
      const turnaroundTime = waitingTime + next.burst_time;
      const endTime = startTime + next.burst_time;

      sequence.push({ ...next, arrival_time: startTime });
      processStats.push({ ...next, startTime, endTime, waitingTime, turnaroundTime });

      currentTime = endTime;
    } else {
      const nextArrival = sortedByArrival[index].arrival_time;
      const idleDuration = nextArrival - currentTime;
      sequence.push({
        process_id: -1,
        arrival_time: -1,
        burst_time: idleDuration,
        background: "transparent",
      });
      currentTime = nextArrival;
    }
  }

  const totalTime = currentTime - (processes.length > 0 ? Math.min(...processes.map(p => p.arrival_time)) : 0);
  const avgWaitingTime = processStats.reduce((sum, p) => sum + p.waitingTime, 0) / (processes.length || 1);
  const avgTurnaroundTime = processStats.reduce((sum, p) => sum + p.turnaroundTime, 0) / (processes.length || 1);
  const cpuUtilization = (totalBurstTime / (totalTime || 1)) * 100;
  const throughput = processes.length / (totalTime || 1);

  return {
    sequence: mergeConsecutive(sequence),
    processStats,
    stats: {
      avgWaitingTime,
      avgTurnaroundTime,
      cpuUtilization,
      throughput
    }
  };
}

/**
 * Merges consecutive blocks of the same process (or idle time) in the sequence.
 */
function mergeConsecutive(sequence: Process[]): Process[] {
  if (sequence.length === 0) return [];

  const merged: Process[] = [{ ...sequence[0] }];

  for (let i = 1; i < sequence.length; i++) {
    const current = sequence[i];
    const last = merged[merged.length - 1];

    if (current.process_id === last.process_id) {
      last.burst_time += current.burst_time;
    } else {
      merged.push({ ...current });
    }
  }

  return merged;
}
  