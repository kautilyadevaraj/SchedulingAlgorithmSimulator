// Algorithms.ts

/**
 * Define the Process type
 */
export type Process = {
  process_id: number;
  arrival_time: number;
  burst_time: number;
  priority: number;
  background: string;
};

export type AlgorithmConfig = {
  quantum?: number;
  mlfqQueues?: {
    id: number;
    algorithm: "RR" | "SRTF" | "FCFS";
    quantum?: number;
  }[];
};

export type ScheduledProcess = Process & {
  startTime: number;
  endTime: number;
  waitingTime: number;
  turnaroundTime: number;
};

export type SimulationResult = {
  algorithmName: string;
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
 * Applies the Shortest Remaining Time First (SRTF) preemptive scheduling algorithm.
 */
export function shortestRemainingTimeFirst(processes: Process[]): SimulationResult {
  if (processes.length === 0) {
    return {
      algorithmName: "SRTF",
      sequence: [],
      processStats: [],
      stats: { avgWaitingTime: 0, avgTurnaroundTime: 0, cpuUtilization: 0, throughput: 0 },
    };
  }

  const n = processes.length;
  const remainingTime = new Map<number, number>();
  const firstStartTime = new Map<number, number>();
  const completionTime = new Map<number, number>();

  processes.forEach((p) => {
    remainingTime.set(p.process_id, p.burst_time);
  });

  const sequence: Process[] = [];
  let currentTime = Math.min(...processes.map((p) => p.arrival_time));
  let completed = 0;

  // If there's a gap between 0 and the first arrival
  if (currentTime > 0) {
    sequence.push({
      process_id: -1,
      arrival_time: -1,
      burst_time: currentTime,
      priority: 0,
      background: "transparent",
    });
  }

  while (completed < n) {
    const availableProcesses = processes.filter(
      (p) => p.arrival_time <= currentTime && (remainingTime.get(p.process_id) || 0) > 0
    );

    if (availableProcesses.length > 0) {
      availableProcesses.sort((a, b) => {
        const remainingA = remainingTime.get(a.process_id)!;
        const remainingB = remainingTime.get(b.process_id)!;
        if (remainingA !== remainingB) return remainingA - remainingB;
        if (a.arrival_time !== b.arrival_time) return a.arrival_time - b.arrival_time;
        return a.process_id - b.process_id;
      });

      const current = availableProcesses[0];
      const id = current.process_id;

      if (!firstStartTime.has(id)) {
        firstStartTime.set(id, currentTime);
      }

      // Execute for 1 time unit
      remainingTime.set(id, remainingTime.get(id)! - 1);
      
      sequence.push({
        ...current,
        burst_time: 1,
        arrival_time: currentTime,
      });

      currentTime++;

      if (remainingTime.get(id) === 0) {
        completed++;
        completionTime.set(id, currentTime);
      }
    } else {
      // Idle time
      sequence.push({
        process_id: -1,
        arrival_time: -1,
        burst_time: 1,
        priority: 0,
        background: "transparent",
      });
      currentTime++;
    }
  }

  const processStats: ScheduledProcess[] = processes.map((p) => {
    const end = completionTime.get(p.process_id)!;
    const turnaround = end - p.arrival_time;
    const wait = turnaround - p.burst_time;
    return {
      ...p,
      startTime: firstStartTime.get(p.process_id)!,
      endTime: end,
      waitingTime: wait,
      turnaroundTime: turnaround,
    };
  });

  const totalTime = currentTime - Math.min(...processes.map(p => p.arrival_time));
  const totalBurstTime = processes.reduce((sum, p) => sum + p.burst_time, 0);
  
  return {
    algorithmName: "SRTF",
    sequence: mergeConsecutive(sequence),
    processStats,
    stats: {
      avgWaitingTime: processStats.reduce((sum, p) => sum + p.waitingTime, 0) / n,
      avgTurnaroundTime: processStats.reduce((sum, p) => sum + p.turnaroundTime, 0) / n,
      cpuUtilization: (totalBurstTime / (totalTime || 1)) * 100,
      throughput: n / (totalTime || 1),
    },
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
  