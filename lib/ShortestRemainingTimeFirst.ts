type Process = {
  arrival_time: number;
  burst_time: number;
  background: string;
};

export function shortestRemainingTimeFirst(processes: Process[]): Process[] {
  const result: Process[] = [];
  const n = processes.length;
  const remainingTime = processes.map((p) => p.burst_time);
  let time = 0;
  let completedProcesses = 0;

  while (completedProcesses < n) {
    // Find available processes that have not completed
    const availableProcesses = processes.filter(
      (p, index) => p.arrival_time <= time && remainingTime[index] > 0
    );

    // Handle no available processes
    if (availableProcesses.length === 0) {
      const arrivingProcesses = processes.filter((p) => p.arrival_time > time);
      if (arrivingProcesses.length > 0) {
        time = Math.min(...arrivingProcesses.map((p) => p.arrival_time));
      }
      continue;
    }

    // Find the process with the shortest remaining time
    const nextProcessIndex = availableProcesses.reduce((minIndex, curr) => {
      const currIndex = processes.indexOf(curr);
      const minProcessIndex = processes.indexOf(availableProcesses[minIndex]);
      return remainingTime[currIndex] < remainingTime[minProcessIndex]
        ? currIndex
        : minProcessIndex;
    }, 0);

    const nextProcess = processes[nextProcessIndex];

    // Execute the process for one time unit
    result.push(nextProcess);
    remainingTime[nextProcessIndex]--;

    if (remainingTime[nextProcessIndex] === 0) {
      completedProcesses++;
    }

    time++;
  }

  return result;
}