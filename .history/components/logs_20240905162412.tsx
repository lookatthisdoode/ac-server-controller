"use client";
import { useEffect, useState } from "react";

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [ws, setWs] = useState(null);
  const [service, setService] = useState("germany");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8085");

    socket.onmessage = (event) => {
      // Split incoming data by newline and add to logs
      const newEntries = event.data.split("\n");

      // Combine new entries with existing logs
      setLogs((prevLogs) => {
        // Concatenate new entries with previous logs
        const updatedLogs = prevLogs.concat(newEntries);

        // Trim logs if the total number of entries exceeds 1000
        if (updatedLogs.length > 1000) {
          return updatedLogs.slice(-1000); // Keep the latest 1000 entries
        }

        return updatedLogs;
      });
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onopen = () => {
      setWs(socket);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleServiceChange = (event) => {
    setService(event.target.value);
    if (ws) {
      ws.send(
        JSON.stringify({ action: "switch", service: event.target.value })
      );
    }
  };

  return (
    <div>
      <h1>Logs for {service}</h1>
      <input
        type="text"
        value={service}
        onChange={handleServiceChange}
        placeholder="Enter service name"
      />
      <pre>
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </pre>
    </div>
  );
};

export default LogsPage;
