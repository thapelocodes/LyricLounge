const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { authMiddleware, verifyToken } = require("./middleware/authMiddleware");
const Message = require("./models/Message"); // Import the Message model
require("dotenv").config();

const app = express();
const port = process.env.PORT;

connectDB();

app.use(express.json());
app.get("/health", (req, res) => {
  res.send("Server is running");
});
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const clients = new Map();

wss.on("connection", (ws, req) => {
  console.log("New client connected");

  ws.on("message", async (message) => {
    try {
      console.log("Received message:", message);
      const { token, type, data } = JSON.parse(message);
      const user = await verifyToken(token);

      if (!user) {
        console.log("Invalid token, closing connection");
        ws.close();
        return;
      }

      if (type === "authenticate") {
        console.log("Client authenticated:", user.username);
        clients.set(user._id.toString(), ws);
      }

      if (type === "chatMessage") {
        console.log("New message from:", user.username);
        console.log("Message:", data.content);

        const broadcastMessage = {
          type: "chatMessage",
          data: data,
        };

        // Broadcast the message to all clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(broadcastMessage));
          }
        });
      }
    } catch (error) {
      console.error("WebSocket error:", error);
    }
  });

  ws.on("close", () => {
    for (const [key, value] of clients.entries()) {
      if (value === ws) {
        clients.delete(key);
        console.log("Client disconnected:", key);
        break;
      }
    }
  });
});

app.use((req, res, next) => {
  req.wss = wss;
  req.clients = clients;
  next();
});

app.use("/api/messages", messageRoutes);

console.log("WebSocket server is running");

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
