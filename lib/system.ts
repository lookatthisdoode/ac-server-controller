// Server code
"use server";
import os from "os";

// Helper function to calculate CPU usage
function getCpuUsage() {
  const cpus = os.cpus();
  return cpus.map((cpu) => {
    const total = Object.values(cpu.times).reduce((acc, tv) => acc + tv, 0);
    const usage = 100 - (100 * cpu.times.idle) / total;
    return usage.toFixed(1);
  });
}

// Convert bytes to GB
function bytesToGB(bytes: number) {
  return (bytes / (1024 * 1024 * 1024)).toFixed(2);
}

// Function to get system details
export async function getSystemDetails() {
  const cpuUsage = getCpuUsage(); // Get CPU usage

  // Get memory information
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  return {
    os: `${os.type()} ${os.arch()}`,
    cpuUsage,
    memoryUsage: {
      total: parseFloat(bytesToGB(totalMem)),
      used: parseFloat(bytesToGB(usedMem)),
      free: parseFloat(bytesToGB(freeMem)),
    },
  };
}
