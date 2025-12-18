// =========================================
// FILE: src/socket.js
// Socket.IO client integration
// =========================================
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');

export default socket;
