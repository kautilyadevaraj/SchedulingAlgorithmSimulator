import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Timer, Zap, Cpu, BarChart3 } from "lucide-react";

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
    { 
      label: "Espera Promedio", 
      value: stats.avgWaitingTime.toFixed(2), 
      unit: "ms",
      icon: Timer,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    { 
      label: "Retorno Promedio", 
      value: stats.avgTurnaroundTime.toFixed(2), 
      unit: "ms",
      icon: Zap,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10"
    },
    { 
      label: "Throughput", 
      value: stats.throughput.toFixed(2), 
      unit: "proc/ms",
      icon: BarChart3,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10"
    },
    { 
      label: "Utilización CPU", 
      value: stats.cpuUtilization.toFixed(2), 
      unit: "%",
      icon: Cpu,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      {displayStats.map((stat) => (
        <Card key={stat.label} className="overflow-hidden border-none shadow-md bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-tight">
                  {stat.label}
                </span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {stat.unit}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-2xl ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
