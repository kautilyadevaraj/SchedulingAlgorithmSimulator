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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
      {displayStats.map((stat) => (
        <Card key={stat.label} className="overflow-hidden border shadow-sm bg-card/40 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl shrink-0 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                  {stat.label}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold tracking-tight text-foreground leading-none">
                    {stat.value}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {stat.unit}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
