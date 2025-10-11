import dotenv from 'dotenv';
import app from './src/app.js';
import { createServer } from "http";
import { initializeSocket } from "./src/utils/initializeSocket.js";
// Load environment variables
dotenv.config({ quiet: true });

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Initialize Socket.IO
initializeSocket(httpServer);
