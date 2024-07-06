const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.get("/health", (req, res) => {
  res.send("Server is running");
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("New client connected");
  ws.on("message", (message) => {
    console.log("Received:", message);
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server is running");

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
