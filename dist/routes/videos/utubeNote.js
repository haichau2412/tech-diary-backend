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
const video_1 = require("../../models/video");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const router = (0, express_1.Router)();
router.get("/videos/:youtubeId", (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // if (!token) {
    //     res.status(401).json({ message: 'Unauthorized' });
    //     return
    // }
    return;
    const video = yield video_1.Video.findOne({
        youtubeId: req.params.youtubeId
    }).exec();
    if (video === null) {
        const err = new Error("Video not found");
        res.status(404).json({
            status: false,
            message: err.message,
        });
        return;
    }
    res.status(200).json({
        status: true,
        data: 'haha',
    });
})));
router.post("/api/videos/", (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { youtubeId, customName, userId } = req.body;
        if (!youtubeId) {
            res.status(400).json({
                success: false,
                message: 'Title and content are required.',
            });
            return;
        }
        const user = yield video_1.User.findOne({
            uuid: userId
        });
        if (user) {
            const video = yield video_1.Video.find({
                youtubeId
            });
            if (video.length === 0) {
                const newDoc = new video_1.Video({
                    youtubeId,
                    userId: user._id,
                    userUUID: user.uuid,
                    customName
                });
                yield newDoc.save();
                res.location(`/api/videos/${youtubeId}`).status(201).json({
                    success: true,
                    message: 'Resource created successfully'
                });
                return;
            }
        }
        res.location(`/api/videos/${youtubeId}`).status(409).json({
            success: false,
            message: 'Resource exist'
        });
        return;
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
})));
router.get("/api/videos/:youtubeId/notes", (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const video = yield video_1.Video.findOne({
        youtubeId: req.params.youtubeId
    }).exec();
    if (video === null) {
        const err = new Error("Video not found");
        res.status(404).json({
            status: false,
            message: err.message,
        });
        return;
    }
    res.status(200).json({
        status: true,
        data: 'haha',
    });
})));
router.post("/api/videos/:youtubeId/notes", (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const video = yield video_1.Video.findOne({
        youtubeId: req.params.youtubeId
    }).exec();
    if (video === null) {
        const err = new Error("Video not found");
        res.status(404).json({
            status: false,
            message: err.message,
        });
        return;
    }
    res.status(200).json({
        status: true,
        data: 'haha',
    });
})));
router.put("/api/videos/:youtubeId/notes/:noteId", (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const video = yield video_1.Video.findOne({
        youtubeId: req.params.youtubeId
    }).exec();
    if (video === null) {
        const err = new Error("Video not found");
        res.status(404).json({
            status: false,
            message: err.message,
        });
        return;
    }
    res.status(200).json({
        status: true,
        data: 'haha',
    });
})));
exports.default = router;
