"use client";
import { useState, useEffect } from "react";

export type Server = {
  name: string;
  serviceRef: string;
};

export default function Logs() {
  const [logs, setLogs] = useState<string[]>([]);
  const [activeServer, setActiveServer] = useState<Server | null>(servers[0]);

  useEffect(() => {
    if (!activeServer) return;

    const socket = new WebSocket(
      `ws://your-server-url/${activeServer.serviceRef}`
    ); // Dynamic WebSocket URL

    socket.onopen = () => {
      console.log(`Connected to WebSocket for ${activeServer.name}`);
    };

    socket.onmessage = (event) => {
      setLogs((prevLogs) => {
        const newLogs = prevLogs.concat(event.data.split("\n"));
        if (newLogs.length > 1000) {
          return newLogs.slice(newLogs.length - 1000);
        }
        return newLogs;
      });
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log(`WebSocket connection closed for ${activeServer.name}`);
    };

    return () => {
      socket.close();
    };
  }, [activeServer]);

  const handleServerChange = (server: Server) => {
    setLogs([]); // Clear logs when switching servers
    setActiveServer(server);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-5 h-full flex flex-col">
      <h2 className="text-lg font-bold mb-3">Server Logs</h2>

      <div className="flex space-x-3 mb-5">
        {servers.map((server) => (
          <button
            key={server.serviceRef}
            onClick={() => handleServerChange(server)}
            className={`p-2 rounded border ${
              activeServer?.serviceRef === server.serviceRef
                ? "bg-emerald-600 text-white"
                : "bg-gray-600 text-gray-300"
            }`}
          >
            {server.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-700 p-4 rounded">
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <p key={index} className="text-sm text-white">
              {log}
            </p>
          ))
        ) : (
          <p className="text-gray-400">No logs available.</p>
        )}
      </div>
    </div>
  );
}
