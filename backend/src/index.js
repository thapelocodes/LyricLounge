const express = require("express");
const http = require("http");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
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
app.use("/api/messages", messageRoutes);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
