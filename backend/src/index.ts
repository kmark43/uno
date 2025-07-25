import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import GameRoom, { User, Card, GameState } from './gameRoom';

const express = require('express');
const app = express();
const server = createServer(app);

interface ServerToClientEvents {
    joinRoom: (socketId: string, gameState: GameState) => void;
    selfJoinRoom: (socketId: string, userHand: Card[]) => void;
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
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
  }
});

const port = 4000;

const roomMap = new Map<string, GameRoom>();

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnecting', () => {
        console.log('User disconnected');
        for (let room of socket.rooms) {
            console.log(`removing user from room ${room}`)
            roomMap.get(room)?.removeUser(socket.id);
        }
    });

    socket.on('joinRoom', (roomId) => {
        console.log(`${socket.id} is joining ${roomId}`);
        if (!roomMap.has(roomId)) {
            roomMap.set(roomId, new GameRoom());
        }
        const gameRoom = roomMap.get(roomId)!;
        const user = gameRoom.addUser(socket.id);
        socket.join(roomId);
        console.log(`socket rooms - ${JSON.stringify(socket.rooms)}`);
        socket.emit('selfJoinRoom', socket.id, user.hand);
        io.to(roomId).emit('joinRoom', socket.id, gameRoom.getGameState());
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