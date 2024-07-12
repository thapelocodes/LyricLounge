const socket = new WebSocket("ws://localhost:5000");

socket.onopen = () => {
  console.log("WebSocket connection established");
};

socket.onclose = (event) => {
  if (event.wasClean) {
    console.log(
      `WebSocket connection closed cleanly, code=${event.code}, reason=${event.reason}`
    );
  } else {
    console.log("WebSocket connection closed unexpectedly");
  }
};

socket.onerror = (error) => {
  console.error("WebSocket error:", error);
};

export default socket;
