// shortestJobFirst.ts

// Define the Process type
type Process = {
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
          arrival_time: -1,
          burst_time: gapDuration,
          background: "transparent",
        });
        currentTime += gapDuration;
      }
    }
  
    return result;
  }
  