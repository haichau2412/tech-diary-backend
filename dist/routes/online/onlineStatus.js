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
let onlineUsers = new Set();
router.get("/onlineStatus", (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
})));
router.post("/status", (req, res) => {
    const { userId, online } = req.body;
    if (online) {
        onlineUsers.add(userId);
    }
    else {
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
exports.default = router;
