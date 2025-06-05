import { createServer } from 'node:http';
import { Server } from 'socket.io';
import type { Socket } from 'socket.io';
import 'dotenv/config';

const port = 3036;

const server = createServer();
const io = new Server(server, {
    cors: {
        // origin: process.env.CLIENT_URL, //https://gamechu.com
        origin: '*', // www.gamechu.com, gamechu.com
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket: Socket) => {
    console.log(`Socket-Server: a user connected (id: ${socket.id})`);

    socket.on('join room', (roomId: string) => {
        socket.join(roomId);
        console.log(`Socket-Server: User ${socket.id} joined room ${roomId}`);
    });

    socket.on(
        'chat message',
        (msg: { id: number; roomId: string; memberId: string; nickname: string; text: string }) => {
            io.to(msg.roomId).emit('chat message', msg);
            console.log(msg);
        }
    );

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('error', (error: unknown) => {
        if (error instanceof Error) {
            console.error(`Error on socket ${socket.id}:`, error.message);
        } else {
            console.error(`Unknown error on socket ${socket.id}:`, error);
        }
    });
});

server.listen(port, () => {
    console.log(`🚀 Socket.IO server running at http://gamechu.com:${port}`);
});
