import { Server } from 'socket.io';
import cors from 'cors';

function initializeSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "*", // or specify your allowed origins
            methods: ["GET", "POST", "PUT", "DELETE"] // or specify your allowed methods
        }
    });

    return io;
}

export default initializeSocket;
