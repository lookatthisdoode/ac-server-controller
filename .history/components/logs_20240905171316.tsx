"use client";
import { useState, useEffect, useRef } from "react";

export default function Logs() {
  const [logs, setLogs] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [logsActive, setLogsActive] = useState(true);
  const [activeService, setActiveService] = useState("germany");
  const serverOptions = ["germany", "nurburgring", "japan", "rally"];
  const logWindowRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    // Scroll to bottom whenever logs are updated
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

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
    <div className="bg-gray-800 px-5 h-full flex flex-col rounded-lg">
      <div className="flex h-[10%] gap-2 items-center">
        Logs
        <button
          className={`flex border-2 p-1 ${
            logsActive
              ? " border-emerald-500 justify-start"
              : "border-red-500 justify-end"
          } rounded-full w-12 h-6`}
          onClick={toggleLogs}
        >
          <div
            className={`${
              logsActive ? "bg-emerald-500" : "bg-red-500"
            } h-full rounded-full aspect-square`}
          ></div>
        </button>
      </div>
      <div
        ref={logWindowRef}
        className="overflow-y-scroll flex-1 p-5 bg-gray-400 rounded-lg text-black"
      >
        {logsActive &&
          logs.map((log) => {
            return <div className="flex">{log}</div>;
          })}
      </div>
      <div className="flex h-[10%] w-full justify-around p-2">
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
