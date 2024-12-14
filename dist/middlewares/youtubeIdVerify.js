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
exports.youtubeIdVerify = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
function removeHashtags(str = '') {
    return str.replace(/#\S+/g, "").trim();
}
exports.youtubeIdVerify = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { youtubeId } = req.body;
    try {
        const response = yield fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${youtubeId}&key=${process.env.YOUTUBE_API}`);
        const data = yield response.json();
        console.log('youtubeIdVerify');
        if (response.status === 200 && data.items && data.items.length > 0) {
            console.log('youtubeIdVerify asasa');
            const item = data.items[0];
            res.locals.defaultName = removeHashtags(item.snippet.title);
            next();
            return;
        }
    }
    catch (err) {
        // no error handling
    }
    res.status(400).json({ message: 'Invalid youtube link' });
    return;
}));
