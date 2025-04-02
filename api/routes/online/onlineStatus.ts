import { Router, Request, Response } from 'express';
import { verifyTokenMW } from '../../middlewares/tokenVerify';

import expressAsyncHandler from "express-async-handler"

const router = Router()

let clients:any[] = [];
let onlineUsers = new Set();

router.get("/onlineStatus",
    expressAsyncHandler(async (req: Request, res: Response) => {
    console.log("New client connected");

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders(); // Ensure headers are sent immediately

    clients.push(res); // Store the connection

    console.log("New client connected");

    req.on("close", () => {
        clients = clients.filter(client => client !== res);
    });
}))

router.post("/status", (req, res) => {
    const { userId, online } = req.body;

    if (online) {
        onlineUsers.add(userId);
    } else {
        onlineUsers.delete(userId);
    }

    broadcastStatus();
    res.send({ success: true });
});


const broadcastStatus = () => {
    const data = JSON.stringify({ onlineUsers: Array.from(onlineUsers) });

    clients.forEach(client => {
        client.write(`data: ${data}\n\n`);
    });
};

export default router