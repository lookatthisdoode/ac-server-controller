const WebSocket = require("ws");
const { spawn, exec } = require("child_process");
const http = require("http");

const server = http.createServer();
const wss = new WebSocket.Server({ server });

let currentProcess = null;

const startProcess = (service) => {
  if (currentProcess) {
    currentProcess.kill();
  }

  // Ensure that journalctl command is properly executed
  currentProcess = spawn("sudo", ["journalctl", "-fu", service]);

  currentProcess.stdout.on("data", (data) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data.toString());
      }
    });
  });

  currentProcess.stderr.on("data", (data) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Error: ${data.toString()}`);
      }
    });
  });

  // currentProcess.on("close", (code) => {
  //   console.log(`Process exited with code ${code}`);
  // });
};

wss.on("connection", (ws) => {
  console.log("Client connected");

  // Start default process
  startProcess("germany");

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    if (data.action === "switch" && data.service) {
      startProcess(data.service);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    if (currentProcess) {
      currentProcess.kill();
    }
  });
});

server.listen(8085, () => {
  console.log("WebSocket server is listening on ws://localhost:8085");
});
