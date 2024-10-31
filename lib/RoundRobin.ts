// roundRobin.ts

// Define the Process type
type Process = {
    arrival_time: number;
    burst_time: number;
    background: string;
  };
  
  /**
   * Applies the Round Robin scheduling algorithm on an array of process objects.
   *
   * @param {Process[]} processes - Array of process objects, each having arrival_time, burst_time, and background properties.
   * @param {number} quantum - The time slice for each process.
   * @returns {Process[]} - Array of processes, scheduled based on the Round Robin algorithm.
   */
  export function roundRobin(processes: Process[], quantum: number): Process[] {
    const sortedProcesses = [...processes].sort(
      (a, b) => a.arrival_time - b.arrival_time
    );
    const result: Process[] = [];
    const queue: { process: Process; remaining_time: number }[] = [];
    let currentTime = 0;
    let index = 0;
  
    while (queue.length > 0 || index < sortedProcesses.length) {
      // Enqueue newly arrived processes
      while (index < sortedProcesses.length && sortedProcesses[index].arrival_time <= currentTime) {
        queue.push({
          process: sortedProcesses[index],
          remaining_time: sortedProcesses[index].burst_time,
        });
        index++;
      }
  
      if (queue.length === 0) {
        // Idle time until the next process arrives
        const nextProcess = sortedProcesses[index];
        const gapDuration = nextProcess.arrival_time - currentTime;
        result.push({
          arrival_time: -1,
          burst_time: gapDuration,
          background: "transparent",
        });
        currentTime += gapDuration;
      } else {
        // Dequeue a process and execute it for the quantum or until it finishes
        const { process, remaining_time } = queue.shift()!;
        const executionTime = Math.min(remaining_time, quantum);
  
        // Add the process slice to the result
        result.push({
          ...process,
          arrival_time: currentTime,
          burst_time: executionTime,
        });
  
        currentTime += executionTime;
  
        // If the process has remaining time, requeue it; otherwise, it completes
        if (remaining_time > quantum) {
          queue.push({
            process,
            remaining_time: remaining_time - quantum,
          });
        }
      }
    }
  
    return result;
  }
  