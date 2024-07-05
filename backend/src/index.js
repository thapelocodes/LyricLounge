import express from "express";

const app = express();
port = process.env.PORT || 5000;

app.get("/health", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
