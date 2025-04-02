"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const router = (0, express_1.Router)();
let clients = [];
const _secret = `${process.env.ONLINE_SECRET}`;
let _status = 'offline';
let _lastSeen = 0;
const createStr = () => {
    const data = {};
    data.status = _status;
    if (_lastSeen > 0) {
        data.lastSeen = _lastSeen;
    }
    console.log('data', data);
    return JSON.stringify(data);
};
router.get("/onlineStatus", (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders(); // Ensure headers are sent immediately
    clients.push(res); // Store the connection
    req.on("close", () => {
        clients = clients.filter(client => client !== res);
    });
    setTimeout(() => {
        const dataStr = createStr();
        res.write(`data: ${dataStr}\n\n`);
    }, 500);
})));
router.post("/status", (req, res) => {
    const { secretCode, status } = req.body;
    if (_secret === secretCode) {
        _status = status !== null && status !== void 0 ? status : 'online';
        console.log('secretCode', secretCode, _status);
        if (_status === 'offline') {
            _lastSeen = Date.now();
        }
    }
    broadcastStatus();
    res.send({ success: true });
});
const broadcastStatus = () => {
    const dataStr = createStr();
    clients.forEach(client => {
        client.write(`data: ${dataStr}\n\n`);
    });
};
exports.default = router;
