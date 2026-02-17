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
 * Applies the Shortest Remaining Time First (SRTF) preemptive scheduling algorithm.
 */
export function shortestRemainingTimeFirst(processes: Process[]): SimulationResult {
  if (processes.length === 0) {
    return {
      sequence: [],
      processStats: [],
      stats: { avgWaitingTime: 0, avgTurnaroundTime: 0, cpuUtilization: 0, throughput: 0 },
    };
  }

  const n = processes.length;
  const remainingTime = new Map<number, number>();
  const arrivalTimeMap = new Map<number, number>();
  const burstTimeMap = new Map<number, number>();
  const backgroundMap = new Map<number, string>();
  const firstStartTime = new Map<number, number>();
  const completionTime = new Map<number, number>();

  processes.forEach((p) => {
    remainingTime.set(p.process_id, p.burst_time);
    arrivalTimeMap.set(p.process_id, p.arrival_time);
    burstTimeMap.set(p.process_id, p.burst_time);
    backgroundMap.set(p.process_id, p.background);
  });

  const sequence: Process[] = [];
  let currentTime = Math.min(...processes.map((p) => p.arrival_time));
  let completed = 0;
  let lastProcessId = -2; // Start with something that won't match any ID

  // If there's a gap between 0 and the first arrival
  if (currentTime > 0) {
    sequence.push({
      process_id: -1,
      arrival_time: -1,
      burst_time: currentTime,
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
      lastProcessId = id;
    } else {
      // Idle time
      sequence.push({
        process_id: -1,
        arrival_time: -1,
        burst_time: 1,
        background: "transparent",
      });
      currentTime++;
      lastProcessId = -1;
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
  