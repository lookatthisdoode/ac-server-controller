import { getSystemDetails } from "@/lib/system";
import { Progress } from "@/components/ui/progress";

export default async function Stats() {
  const systemInfo = await getSystemDetails();

  return (
    <main className="bg-background">
      <div className="space-y-2 flex flex-col gap-5">
        <h3 className="text-lg font-semibold text-foreground">Memory Usage</h3>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Used</span>
          <span>
            {systemInfo.memoryUsage.used.toFixed(2)} /{" "}
            {systemInfo.memoryUsage.total.toFixed(2)} GB
          </span>
        </div>
        <Progress
          value={
            (systemInfo.memoryUsage.used / systemInfo.memoryUsage.total) * 100
          }
          className="h-2"
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">CPU Usage</h3>
        {systemInfo.cpuUsage.map((usage, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Core {index}</span>
              <span>{usage}%</span>
            </div>
            <Progress value={parseFloat(usage)} className="h-2" />
          </div>
        ))}
      </div>
    </main>
  );
}
