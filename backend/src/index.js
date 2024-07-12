const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoomRoutes = require("./routes/chatRoomRoutes");

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/health", (req, res) => {
  res.send("Server is running");
});
app.use("/api/users", userRoutes);
app.use("/api/chatrooms", chatRoomRoutes);

app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);
  res.status(500).send("Something broke!");
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
