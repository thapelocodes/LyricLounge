const express = require("express");
const http = require("http");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const WebSocket = require("ws");
const { verifyToken } = require("./middleware/authMiddleware");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

connectDB();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.get("/health", (req, res) => {
  res.send("Server is running");
});
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", async (message) => {
    try {
      const { token, type, data } = JSON.parse(message);
      const user = await verifyToken(token);

      if (!user) {
        console.log("Invalid token, closing connection");
        ws.close();
        return;
      }

      if (type === "authenticate") {
        console.log("Client authenticated:", user.username);
      }

      if (type === "chatMessage") {
        console.log("New message from:", user.username);
        console.log("Message:", data.content);

        const broadcastMessage = {
          type: "chatMessage",
          data: {
            chatroomId: data.chatroomId,
            sender: user.username,
            content: data.content,
            timestamp: new Date(),
          },
        };

        // Broadcast the message to all clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN && client !== ws) {
            client.send(JSON.stringify(broadcastMessage));
          }
        });
      }
    } catch (error) {
      console.error("WebSocket error:", error);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
