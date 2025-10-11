import { Server } from "socket.io";

const allowedOrigins = [
  "http://localhost:5000",
  "http://localhost:5173",
  "https://rydroo.onrender.com",
];

let io;
export function initializeSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Server: user connected", socket.id);

    socket.on("join", (userId) => {
      console.log(`Server: socket ${socket.id} joining room ${userId}`);
      socket.join(userId);
    });

    socket.on("disconnect", (reason) => {
      console.log(`Server: user ${socket.id} disconnected (${reason})`);
    });
  });
}

export const getSocketIOInstance = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};
