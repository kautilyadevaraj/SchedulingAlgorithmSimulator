// shortestJobFirst.ts

// Define the Process type
type Process = {
  process_id: number;
  arrival_time: number;
  burst_time: number;
  background: string;
};

  
  /**
   * Applies the Shortest Job First (SJF) scheduling algorithm on an array of process objects.
   *
   * @param {Process[]} processes - Array of process objects, each having arrival_time, burst_time, and background properties.
   * @returns {Process[]} - Array of processes, scheduled based on the SJF algorithm.
   */
  export function shortestJobFirst(processes: Process[]): Process[] {
    // Clone and sort the processes by arrival time to avoid side effects
    const sortedProcesses = [...processes].sort(
      (a, b) => a.arrival_time - b.arrival_time
    );
  
    const result: Process[] = [];
    const availableProcesses: Process[] = [];
    let currentTime = 0;
    let index = 0;
  
    while (index < sortedProcesses.length || availableProcesses.length > 0) {
      // Move processes that have arrived by `currentTime` into the available processes queue
      while (index < sortedProcesses.length && sortedProcesses[index].arrival_time <= currentTime) {
        availableProcesses.push(sortedProcesses[index]);
        index++;
      }
  
      // If there are available processes, pick the one with the shortest burst time
      if (availableProcesses.length > 0) {
        // Sort by burst time to find the shortest job available
        availableProcesses.sort((a, b) => a.burst_time - b.burst_time);
        const nextProcess = availableProcesses.shift()!;
  
        // Add the selected process to the result and advance `currentTime`
        result.push({
          ...nextProcess,
          arrival_time: currentTime, // Start time of this process
        });
  
        currentTime += nextProcess.burst_time; // Process runs to completion
      } else {
        // If no processes are available, create an idle gap until the next process arrives
        const nextProcess = sortedProcesses[index];
        const gapDuration = nextProcess.arrival_time - currentTime;
        result.push({
          process_id : -1,
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
        // Merge with the previous process if the background is the same
        mergedResult[mergedResult.length - 1].burst_time +=
          currentProcess.burst_time;
      } else {
        // Otherwise, add as a new entry
        mergedResult.push({ ...currentProcess });
      }
    }

    return mergedResult;
  }
  