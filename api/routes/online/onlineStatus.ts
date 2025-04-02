import { Router, Request, Response } from 'express';
import expressAsyncHandler from "express-async-handler"

const router = Router()

let clients: any[] = [];

type Status = "online" | "offline" | "busy";

const _secret = `${process.env.ONLINE_SECRET}`

let _status: Status = 'offline'
let _lastSeen: number = 0

const createStr = () => {
    const data: any = {

    }


    data.status = _status

    if (_lastSeen > 0) {
        data.lastSeen = _lastSeen
    }
    console.log('data', data)

    return JSON.stringify(data)
}

router.get("/onlineStatus",
    expressAsyncHandler(async (req: Request, res: Response) => {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders(); // Ensure headers are sent immediately
        clients.push(res); // Store the connection

        req.on("close", () => {
            clients = clients.filter(client => client !== res);
        });

        setTimeout(() => {
            const dataStr = createStr()
            res.write(`data: ${dataStr}\n\n`);
        }, 500)
    }))

router.post("/status", (req, res) => {
    const { secretCode, status } = req.body;
    console.log('secretCode', secretCode, _secret, _secret === secretCode)
    if (_secret === secretCode) {
        _status = status ?? 'online'
        
        console.log('_status', _status)
        if (_status === 'offline') {
            _lastSeen = Date.now()
        }
    }
    broadcastStatus();
    res.send({ success: true });
});


const broadcastStatus = () => {
    const dataStr = createStr()

    clients.forEach(client => {
        client.write(`data: ${dataStr}\n\n`);
    });
};

export default router