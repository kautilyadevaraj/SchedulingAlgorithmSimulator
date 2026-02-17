import AnimatedShinyText from "./ui/animated-shiny-text";
import { Card, CardContent } from "./ui/card";

type SummaryStatisticsProps = {
  stats: {
    avgWaitingTime: number;
    avgTurnaroundTime: number;
    cpuUtilization: number;
    throughput: number;
  };
};

export default function SummaryStatistics({ stats }: SummaryStatisticsProps) {
  const displayStats = [
    { label: "Avg Waiting Time", value: stats.avgWaitingTime.toFixed(2) },
    { label: "Avg Turnaround Time", value: stats.avgTurnaroundTime.toFixed(2) },
    { label: "Throughput", value: stats.throughput.toFixed(2) },
    { label: "CPU Utilization", value: `${stats.cpuUtilization.toFixed(2)}%` },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 w-full lg:max-w-md">
      {displayStats.map((stat) => (
        <Card key={stat.label} className="bg-muted/30 border-none shadow-none">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <AnimatedShinyText className="text-xs font-semibold uppercase tracking-wider mb-1">
              {stat.label}
            </AnimatedShinyText>
            <span className="text-2xl font-bold text-primary">
              {stat.value}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
