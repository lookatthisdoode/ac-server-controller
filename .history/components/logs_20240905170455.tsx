"use client";
import { useState, useEffect } from "react";

export default function Logs() {
  const [logs, setLogs] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [logsActive, setLogsActive] = useState(true);
  const [activeService, setActiveService] = useState("germany");
  const serverOptions = ["germany", "nurburgring", "japan", "rally"];
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8085");

    socket.onmessage = (event) => {
      // Concatenate new log entries and trim to the last 1000 entries
      setLogs((prevLogs) => {
        const newLogs = prevLogs.concat(event.data.split("\n"));
        return newLogs.slice(-1000);
      });
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const toggleLogs = () => {
    setLogsActive(!logsActive);
  };

  const switchServer = (service: string) => {
    if (ws) {
      ws.send(JSON.stringify({ action: "switch", service }));
    }
    setActiveService(service);
    setLogs([]);
  };

  return (
    <div className="bg-gray-800 p-5 h-full flex flex-col rounded-lg">
      <div className="flex h-[10%]">
        Logs
        <button
          className={`${logsActive ? "border border-emerald-500" : ""}`}
          onClick={toggleLogs}
        >
          <div className={`${logsActive ? "bg-emerald-500" : ""} w-12`}></div>
        </button>
      </div>
      <div className="overflow-y-scroll flex-1 p-5 bg-gray-400 rounded-lg text-black">
        {logs.map((log) => {
          return <div className="flex">{log}</div>;
        })}
      </div>
      <div className="flex h-[10%] w-full justify-around ">
        {serverOptions.map((service, index) => (
          <button
            onClick={() => switchServer(service)}
            className={`${activeService === service ? "border-b" : ""}`}
          >
            {service}
          </button>
        ))}
      </div>
    </div>
  );
}
