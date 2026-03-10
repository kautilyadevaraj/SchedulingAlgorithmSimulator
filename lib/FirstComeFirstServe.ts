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
  const sortedProcesses = [...processes].sort((a, b) => a.arrival_time - b.arrival_time);

  const result: Process[] = [];
  let currentTime = 0;

  for (let i = 0; i < sortedProcesses.length; i++) {
    const currentProcess = sortedProcesses[i];

    if (currentProcess.arrival_time > currentTime) {
      const gapDuration = currentProcess.arrival_time - currentTime;
      result.push({
        process_id: -1,
        arrival_time: -1, // Not significant for gap, used to identify Idle state
        burst_time: gapDuration, // Duration of the idle time
        background: "transparent", // Color for gap
      });
      currentTime = currentProcess.arrival_time;
    }

    result.push(currentProcess);
    currentTime += currentProcess.burst_time;
  }

  return result;
}
