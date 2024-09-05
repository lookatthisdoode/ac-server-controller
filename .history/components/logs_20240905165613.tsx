"use client";
import { useState, useEffect } from "react";

export default function Logs() {
  const [logs, setLogs] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [logsActive, setLogsActive] = useState(true);
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
  };

  return (
    <div className="bg-gray-800 p-5 h-full flex flex-col">
      <div className="flex">
        Logs
        <button className={``} onClick={toggleLogs}></button>
      </div>
      <div className="overflow-y-scroll flex-1 p-5">
        <pre className="text-white whitespace-pre-wrap">{logs.join("\n")}</pre>
      </div>
      <div className="flex h-[10%]">
        {serverOptions.map((service, index) => (
          <button
            onClick={() => switchServer("service")}
            className="p-2 border border-slate-400 rounded-md mx-1"
          >
            {service}
          </button>
        ))}
      </div>
    </div>
  );
}
