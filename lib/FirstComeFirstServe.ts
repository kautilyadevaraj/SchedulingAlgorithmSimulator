// Define the Process type
type Process = {
  process_id: number;
  arrival_time: number;
  burst_time: number;
  background: string;
};

/**
 * Applies the First Come First Serve (FCFS) scheduling algorithm
 * on an array of process objects.
 *
 * @param {Process[]} processes - Array of process objects, each having
 *                                arrival_time, burst_time, and background properties.
 * @returns {Process[]} - Array of processes sorted by arrival_time with gaps included.
 */
export function firstComeFirstServe(processes: Process[]): Process[] {
  // Sort processes by arrival time
  processes.sort((a, b) => a.arrival_time - b.arrival_time);

  const result: Process[] = [];

  // Check if there is an initial gap before the first process
  if (processes[0].arrival_time > 0) {
    result.push({
      process_id: -1,
      arrival_time: -1, // Not significant for gap
      burst_time: processes[0].arrival_time, // Duration of the initial idle time
      background: "transparent", // Color for gap
    });
  }

  for (let i = 0; i < processes.length; i++) {
    // Check for a gap before the current process (only if it's not the first process)
    if (i > 0) {
      const previousProcess = processes[i - 1];
      const currentProcess = processes[i];

      // Calculate the end time of the previous process
      const endTimeOfPreviousProcess =
        previousProcess.arrival_time + previousProcess.burst_time;

      // Check if there is a gap
      const gapDuration =
        currentProcess.arrival_time - endTimeOfPreviousProcess;

      if (gapDuration > 0) {
        // Add a gap process object
        result.push({
          process_id: -1,
          arrival_time: -1, // Not significant for gap
          burst_time: gapDuration, // Duration of the idle time
          background: "transparent", // Color for gap
        });
      }
    }

    // Add the actual process
    result.push(processes[i]);
  }

  return result;
}
