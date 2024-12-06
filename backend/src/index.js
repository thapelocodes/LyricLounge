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
const Chatroom = require("./models/Chatroom");
const Message = require("./models/Message");
const { markMessagesAsReceived } = require("./controllers/messageController");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const port = process.env.PORT;
const allowedOrigins = [
  "https://lyric-lounge.vercel.app",
  "https://lyric-lounge-thapelos-projects-7c628723.vercel.app",
];

connectDB();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Welcome to the Lyric Lounge API");
});
app.get("/health", (req, res) => {
  res.send("Server is running");
});
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const connectedUsers = new Map();

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
        connectedUsers.set(user._id, ws);
        console.log("Connected users:");
        for (const [key, value] of connectedUsers) {
          console.log(key);
        }

        // Fetch chatrooms the user is a member of
        const chatrooms = await Chatroom.find({ users: user._id });
        const chatroomIds = chatrooms.map((chatroom) => chatroom._id);

        // Fetch all messages in the chatrooms
        const messages = await Message.find({
          chatroomId: { $in: chatroomIds },
        });
        const messageIds = messages.map((message) => message._id);

        // Mark messages as received
        await markMessagesAsReceived(messageIds, user._id);
      }

      if (type === "chatMessage") {
        console.log("New message from:", user.username);
        console.log("Message:", data.content);

        // Create and save the message
        const newMessage = new Message({
          chatroomId: data.chatroomId,
          sender: user.username,
          content: data.content,
          timestamp: new Date(),
          isSent: true,
          receivedBy: [],
          seenBy: [],
        });
        await newMessage.save();

        // Fetch all connected users in the chatroom
        const userIds = Array.from(connectedUsers.keys());

        // Mark the message as received for all users except the sender
        for (const userId of userIds)
          await markMessagesAsReceived([newMessage._id], userId);

        // Broadcast the message to all clients in the chatroom
        const broadcastMessage = {
          type: "chatMessage",
          data: {
            ...newMessage.toObject(),
            messageId: newMessage._id,
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

  ws.on("close", async () => {
    console.log("Client disconnected");
    const user = [...connectedUsers].find(([key, value]) => value === ws);
    if (user) {
      connectedUsers.delete(user[0]);
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
