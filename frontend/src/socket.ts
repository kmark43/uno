// src/socket.js
import { io } from 'socket.io-client';

// Define the server URL. In production, it might be undefined to use the current window's location.
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';

export const socket = io(URL);
