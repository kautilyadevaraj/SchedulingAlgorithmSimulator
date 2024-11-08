import { turnaroundTime, waitingTime, cpuUtilization, totalExecutionTime } from "./SummaryTable"
import AnimatedShinyText from "./ui/animated-shiny-text";

type Process = {
  process_id: number;
  arrival_time: number;
  burst_time: number;
  background: string;
};

type totalProcessesType = {
  totalProcesses: number;
  scheduledProcesses: Process[];
};

export default function SummaryStatistics({ totalProcesses, scheduledProcesses }: totalProcessesType) {
    console.log(scheduledProcesses);

    return (
      <div className="flex flex-col justify-evenly items-center w-1/2 pl-10 overflow-x-hidden">
        <div className="flex justify-evenly w-full text-center">
          <div className="text-lg">
            <AnimatedShinyText>Avg Waiting Time</AnimatedShinyText>

            {Math.round((waitingTime / totalProcesses) * 100) / 100}
          </div>
          <div className="text-lg">
            <AnimatedShinyText>Avg Turnaround Time</AnimatedShinyText>
            {Math.round((turnaroundTime / totalProcesses) * 100) / 100}
          </div>
        </div>
        <div className="flex justify-evenly w-full text-center">
          <div className="pr-5 text-lg">
            <AnimatedShinyText>Throughput</AnimatedShinyText>
            {Math.round((totalProcesses / totalExecutionTime) * 100) / 100}
          </div>
          <div className="text-lg">
            <AnimatedShinyText>CPU Utilization</AnimatedShinyText>
            {Math.round((cpuUtilization) * 100) / 100}%
          </div>
        </div>
      </div>
    );
}