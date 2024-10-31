// Define the Process type
type Process = {
  process_id: number;
  arrival_time: number;
  burst_time: number;
  background: string;
};

/**
 * Applies the Shortest Remaining Time First (SRTF) scheduling algorithm on an array of process objects.
 *
 * @param {Process[]} processes - Array of process objects, each having arrival_time, burst_time, and background properties.
 * @returns {Process[]} - Array of processes, scheduled based on the SRTF algorithm.
 */
export function shortestRemainingTimeFirst(processes: Process[]): Process[] {
  const sortedProcesses = [...processes].sort(
    (a, b) => a.arrival_time - b.arrival_time
  );
  const result: Process[] = [];
  const queue: { process: Process; remaining_time: number }[] = [];
  let currentTime = 0;
  let index = 0;

  while (queue.length > 0 || index < sortedProcesses.length) {
    // Enqueue newly arrived processes
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

    // Remove completed processes and sort the queue by remaining time
    queue.sort((a, b) => a.remaining_time - b.remaining_time);

    if (queue.length === 0) {
      // Idle time until the next process arrives
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
      // Pick the process with the shortest remaining time
      const { process, remaining_time } = queue.shift()!;
      const executionTime = 1; // SRTF executes in 1 time unit intervals for preemption

      // Add the process slice to the result
      result.push({
        ...process,
        arrival_time: currentTime,
        burst_time: executionTime,
      });

      currentTime += executionTime;

      // If the process has remaining time, requeue it with updated remaining time
      if (remaining_time > executionTime) {
        queue.push({
          process,
          remaining_time: remaining_time - executionTime,
        });
      }
    }
  }

  // Merge consecutive processes with the same background color
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
