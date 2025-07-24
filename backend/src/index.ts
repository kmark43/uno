import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import GameRoom, { User, Card, GameState } from './gameRoom';

const express = require('express');
const app = express();
const server = createServer(app);

interface ServerToClientEvents {
    joinRoom: (socketId: string) => void;
    selfJoinRoom: (socketId: string, user: User) => void;
    updateGameState: (gameState: GameState) => void;
    updateHand: (hand: Card[]) => void;
}

interface ClientToServerEvents {
    joinRoom: (roomId: string) => void;
    playMove: (roomId: string, cardPosition: number) => void;
}

interface InterServerEvents {
    ping: () => void;
}

interface SocketData {
    name: string;
    age: number;
}

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
    cors: {
        origin: "localhost",
        methods: ["GET", "POST"],
        credentials: true
  }
});

const port = 4000;

const roomMap = new Map<string, GameRoom>();

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('joinRoom', (roomId) => {
        console.log(`${socket.id} is joining ${roomId}`);
        if (!roomMap.has(roomId)) {
            roomMap.set(roomId, new GameRoom());
        }
        const user = roomMap.get(roomId)!.addUser(socket.id);
        socket.join(roomId);
        socket.emit('selfJoinRoom', socket.id, user);
        socket.broadcast.to(roomId).emit('joinRoom', socket.id);
    });

    socket.on('playMove', (roomId, cardPosition) => {
        if (roomMap.has(roomId)) {
            const room = roomMap.get(roomId)!;
            const gameState = room.playMove(socket.id, cardPosition);
            io.to(roomId).emit('updateGameState', gameState);
            socket.emit('updateHand', room.getHand(socket.id)!);
        }
    });
});

// Start the server
server.listen(port, () => {
    console.log(`listening on *:${port}`);
});