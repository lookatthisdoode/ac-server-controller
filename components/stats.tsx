// Client-side code
"use client";
import { getSystemDetails } from "@/lib/system";
import { useEffect, useState } from "react";
import ReactSpeedometer from "react-d3-speedometer";

type SystemDetails = {
  os: string;
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

      // Calculate average CPU usage
      const cpuUsageNumbers = details.cpuUsage.map(Number);
      const averageCpuUsage = (
        cpuUsageNumbers.reduce((acc, usage) => acc + usage, 0) /
        cpuUsageNumbers.length
      ).toFixed(1); // Calculate average and round to 1 decimal place

      // Set the state with the average CPU usage and other details
      setSystem({
        ...details,
        cpuUsage: [averageCpuUsage], // Update CPU usage with average
      });
    };

    fetchSystemDetails(); // Call the async function immediately
    const interval = setInterval(fetchSystemDetails, 1000); // Fetch data every 1 second

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, []);

  return system ? (
    <main className="flex flex-col-reverse justify-center h-full items-center">
      <div className="flex">
        {/* RAM */}
        <div>
          <ReactSpeedometer
            maxValue={system.memoryUsage.total}
            value={system.memoryUsage.used}
            currentValueText="Ram: ${value}gb"
            maxSegmentLabels={4}
            valueTextFontSize={"22px"}
            segments={20}
            needleColor="red"
            endColor={"red"}
            startColor={"white"}
          />
        </div>

        {/* CPU */}
        <div>
          <ReactSpeedometer
            maxValue={100}
            value={parseInt(system.cpuUsage[0])}
            currentValueText="CPU: ${value}%"
            maxSegmentLabels={0}
            valueTextFontSize={"22px"}
            segments={20}
            needleColor="blue"
            endColor={"blue"}
            startColor={"white"}
          />
        </div>
      </div>
      <h1 className="text-2xl py-10">{system.os}</h1>
    </main>
  ) : (
    <p>Loading system details...</p>
  );
}
