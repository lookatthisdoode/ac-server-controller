// Client-side code
"use client";
import { getSystemDetails } from "@/lib/system";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

type SystemDetails = {
  cpuUsage: string[];
  memoryUsage: {
    total: number;
    used: number;
    free: number;
  };
};

export default function Stats() {
  const [system, setSystem] = useState<SystemDetails | null>(null); // Typing the state

  useEffect(() => {
    const fetchSystemDetails = async () => {
      const details = await getSystemDetails(); // Fetch system details from server
      setSystem(details); // Set the state with fetched details
    };

    fetchSystemDetails(); // Call the async function immediately
    const interval = setInterval(fetchSystemDetails, 1000); // Fetch data every 1 second

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, []);

  return system ? (
    <main className="bg-background">
      {/* Memory Usage Section */}
      <div className="space-y-2 pb-5">
        <h3 className="text-lg font-semibold text-foreground">Memory Usage</h3>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Used</span>
          <span>
            {system.memoryUsage.used.toFixed(2)} /{" "}
            {system.memoryUsage.total.toFixed(2)} GB
          </span>
        </div>
        <Progress
          value={(system.memoryUsage.used / system.memoryUsage.total) * 100}
          className="h-2"
        />
      </div>

      {/* CPU Usage Section */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">CPU Usage</h3>
        {system.cpuUsage.map((usage, index) => (
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
  ) : (
    <p>Loading system details...</p>
  );
}
