const createWebSocket = (token) => {
  const socket = new WebSocket("ws://localhost:5000");

  socket.onopen = () => {
    console.log("WebSocket connection opened");
    socket.send(JSON.stringify({ type: "authenticate", token }));
  };

  socket.onmessage = (e) => {
    console.log(`Message from server: ${e.data}`);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };

  return socket;
};

export default createWebSocket;
