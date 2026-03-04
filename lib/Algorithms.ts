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
  quantum: number;
  mlfqQueues: {
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
 * Round Robin Virtual (RRV).
 * Progresos que agotan su quantum vuelven a la cola estándar.
 * Los procesos que regresan de una interrupción/bloqueo (en este simulador simplificado,
 * simulamos el comportamiento de prioridad para procesos que no terminaron su quantum)
 * van a la cola virtual.
 */
export function roundRobinVirtual(processes: Process[], quantum: number): SimulationResult {
  if (processes.length === 0) {
    return {
      algorithmName: "RRV",
      sequence: [],
      processStats: [],
      stats: { avgWaitingTime: 0, avgTurnaroundTime: 0, cpuUtilization: 0, throughput: 0 },
    };
  }

  const n = processes.length;
  const remainingTime = new Map<number, number>();
  const firstStartTime = new Map<number, number>();
  const completionTime = new Map<number, number>();
  
  // Track remaining quantum for processes in the virtual queue
  const remainingQuantum = new Map<number, number>();

  processes.forEach((p) => {
    remainingTime.set(p.process_id, p.burst_time);
  });

  const sequence: Process[] = [];
  let currentTime = Math.min(...processes.map((p) => p.arrival_time));
  let completed = 0;

  // Queues
  let readyQueue: number[] = [];
  let virtualQueue: number[] = [];
  const visited = new Set<number>();

  // Helper to add newly arrived processes to ready queue
  const updateReadyQueue = (time: number) => {
    processes.forEach(p => {
      if (p.arrival_time <= time && !visited.has(p.process_id)) {
        readyQueue.push(p.process_id);
        visited.add(p.process_id);
      }
    });
  };

  updateReadyQueue(currentTime);

  while (completed < n) {
    let currentId: number | null = null;

    // RRV Priority: Virtual Queue first
    if (virtualQueue.length > 0) {
      currentId = virtualQueue.shift()!;
    } else if (readyQueue.length > 0) {
      currentId = readyQueue.shift()!;
    }

    if (currentId !== null) {
      const currentProcess = processes.find(p => p.process_id === currentId)!;
      
      if (!firstStartTime.has(currentId)) {
        firstStartTime.set(currentId, currentTime);
      }

      // Calculate how long to run
      // If it was in virtual queue, it only runs for the remaining quantum
      const q = remainingQuantum.has(currentId) ? remainingQuantum.get(currentId)! : quantum;
      const timeLeft = remainingTime.get(currentId)!;
      const runTime = Math.min(q, timeLeft);

      // Record in sequence
      sequence.push({
        ...currentProcess,
        burst_time: runTime,
        arrival_time: currentTime,
      });

      // Update time and state
      // We need to check for arrivals DURING the execution of this quantum
      for (let t = 0; t < runTime; t++) {
        currentTime++;
        updateReadyQueue(currentTime);
      }
      
      const newRemainingTime = timeLeft - runTime;
      remainingTime.set(currentId, newRemainingTime);

      if (newRemainingTime === 0) {
        completed++;
        completionTime.set(currentId, currentTime);
        remainingQuantum.delete(currentId);
      } else {
        // If it exhausted its quantum, it goes to ready queue
        // If it was interrupted (not possible in this basic sync RR, 
        // but RRV assumes if it didn't finish quantum it goes to virtual)
        // In our case, if it still has time but used the full quantum 'q'
        if (runTime === q && q === quantum) {
          readyQueue.push(currentId);
          remainingQuantum.delete(currentId);
        } else if (runTime === q && q < quantum) {
           // It finished its virtual quantum but still has burst time
           readyQueue.push(currentId);
           remainingQuantum.delete(currentId);
        } else {
          // This case won't happen in a simple RR, but for RRV logic:
          // If a process leaves before quantum (e.g. I/O), it would go to virtual queue
          // Since we don't have I/O, we'll simulate it by saying that if we 
          // add a way to "interrupt" processes, they'd go here.
          // For now, let's stick to the standard RR flow within RRV structure.
          readyQueue.push(currentId);
        }
      }
    } else {
      // Idle
      sequence.push({
        process_id: -1,
        arrival_time: -1,
        burst_time: 1,
        priority: 0,
        background: "transparent",
      });
      currentTime++;
      updateReadyQueue(currentTime);
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
    algorithmName: "RRV",
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
 * Multi-Level Feedback Queue (MLFQ).
 * Soporta hasta 3 colas con algoritmos configurables.
 */
export function multiLevelFeedbackQueue(
  processes: Process[],
  config: AlgorithmConfig["mlfqQueues"]
): SimulationResult {
  if (processes.length === 0 || !config || config.length === 0) {
    return {
      algorithmName: "MLFQ",
      sequence: [],
      processStats: [],
      stats: { avgWaitingTime: 0, avgTurnaroundTime: 0, cpuUtilization: 0, throughput: 0 },
    };
  }

  const n = processes.length;
  const remainingTime = new Map<number, number>();
  const firstStartTime = new Map<number, number>();
  const completionTime = new Map<number, number>();
  const currentQueueLevel = new Map<number, number>();

  processes.forEach((p) => {
    remainingTime.set(p.process_id, p.burst_time);
    currentQueueLevel.set(p.process_id, 0); // Start at Q0
  });

  const sequence: Process[] = [];
  let currentTime = Math.min(...processes.map((p) => p.arrival_time));
  let completed = 0;

  // Queues for each level
  const queues: number[][] = config.map(() => []);
  const visited = new Set<number>();

  const updateQueues = (time: number) => {
    processes.forEach(p => {
      if (p.arrival_time <= time && !visited.has(p.process_id)) {
        queues[0].push(p.process_id);
        visited.add(p.process_id);
      }
    });
  };

  updateQueues(currentTime);

  while (completed < n) {
    let targetQueueIndex = queues.findIndex(q => q.length > 0);

    if (targetQueueIndex !== -1) {
      const currentId = queues[targetQueueIndex].shift()!;
      const currentProcess = processes.find(p => p.process_id === currentId)!;
      const queueConfig = config[targetQueueIndex];

      if (!firstStartTime.has(currentId)) {
        firstStartTime.set(currentId, currentTime);
      }

      let runTime = 0;
      const timeLeft = remainingTime.get(currentId)!;

      if (queueConfig.algorithm === "RR") {
        const q = queueConfig.quantum || 4;
        runTime = Math.min(q, timeLeft);
      } else if (queueConfig.algorithm === "FCFS") {
        runTime = timeLeft;
      } else if (queueConfig.algorithm === "SRTF") {
        // Simple implementation of SRTF within MLFQ: 
        // Run until completion or until a new process arrives in a higher queue
        // For simplicity in this dummy-first approach, we'll treat it like RR with quantum 1 
        // but checking for higher priority arrivals
        runTime = 1; 
      }

      sequence.push({
        ...currentProcess,
        burst_time: runTime,
        arrival_time: currentTime,
      });

      for (let t = 0; t < runTime; t++) {
        currentTime++;
        updateQueues(currentTime);
      }

      const newRemainingTime = timeLeft - runTime;
      remainingTime.set(currentId, newRemainingTime);

      if (newRemainingTime === 0) {
        completed++;
        completionTime.set(currentId, currentTime);
      } else {
        // Feedback: Move to next queue if it exhausted its quantum in RR
        if (queueConfig.algorithm === "RR" && runTime === (queueConfig.quantum || 4)) {
          const nextLevel = Math.min(targetQueueIndex + 1, config.length - 1);
          queues[nextLevel].push(currentId);
        } else {
          // Stay in current queue (SRTF or unfinished RR)
          queues[targetQueueIndex].push(currentId);
        }
      }
    } else {
      sequence.push({
        process_id: -1,
        arrival_time: -1,
        burst_time: 1,
        priority: 0,
        background: "transparent",
      });
      currentTime++;
      updateQueues(currentTime);
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
    algorithmName: "MLFQ",
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
  