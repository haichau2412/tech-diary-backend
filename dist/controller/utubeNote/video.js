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
exports.importNote = exports.deleteNote = exports.getNote = exports.addNote = exports.deleteVideo = exports.addVideo = exports.getVideo = exports.updateVideoName = void 0;
const mongo_1 = require("../../models/mongo");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
exports.updateVideoName = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.cookies;
    const { videoId } = req.params;
    const { customName } = req.body;
    yield mongo_1.Video.findOneAndUpdate({
        videoId: videoId,
        userUUID: userId
    }, {
        customName
    });
    res.status(200);
    return;
}));
exports.getVideo = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.cookies;
    const videos = yield mongo_1.Video.find({
        userUUID: userId
    });
    if (videos.length === 0) {
        res.status(204).json({
            data: []
        });
        return;
    }
    res.status(200).json({
        data: videos.map(({ youtubeId, customName }) => ({
            youtubeId,
            customName
        }))
    });
    return;
}));
exports.addVideo = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.cookies;
        const { youtubeId, customName } = req.body;
        const { defaultName } = res.locals;
        if (!youtubeId) {
            res.status(400).json({
                success: false,
                message: 'Title and content are required.',
            });
            return;
        }
        const user = yield mongo_1.User.findOne({
            uuid: userId
        });
        if (user) {
            const video = yield mongo_1.Video.findOne({
                youtubeId,
                userUUID: userId
            });
            if (!video) {
                const newDoc = new mongo_1.Video({
                    youtubeId,
                    userId: user._id,
                    userUUID: user.uuid,
                    customName: customName || defaultName
                });
                yield newDoc.save();
                res.location(`/api/videos/${youtubeId}`).status(201).json({
                    message: 'Resource created successfully'
                });
                return;
            }
            res.status(409).json({
                success: false,
                message: 'Resource exists'
            });
            return;
        }
        res.status(404).json({
            success: false,
            message: 'User id is not found',
        });
        return;
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}));
//TODO: Implement backup feature
exports.deleteVideo = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.cookies;
    const { videoId } = req.params;
    const deletedItem = yield mongo_1.Video.findOneAndDelete({
        userUUID: userId,
        youtubeId: videoId
    }, {
        projection: {
            _id: 1
        }
    });
    if (deletedItem) {
        yield mongo_1.Note.findOneAndDelete({
            videoId: deletedItem._id
        });
        res.status(200);
        return;
    }
    res.status(204);
    return;
}));
exports.addNote = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.cookies;
    const video = yield mongo_1.Video.findOne({
        youtubeId: req.params.youtubeId,
        userUUID: userId
    });
    if (video === null) {
        res.status(404).json({
            message: 'Video not found',
        });
        return;
    }
    const { from, text } = req.body;
    const _note = yield mongo_1.Note.findOne({
        videoId: video._id,
    });
    const hasNote = !!_note;
    let _allNotes = [];
    if (_note) {
        _allNotes = _note.notes;
    }
    _allNotes = _allNotes.filter(({ from: _from }) => _from !== from);
    _allNotes.push({ from, text });
    console.log('result', from, text, _allNotes);
    if (hasNote) {
        yield mongo_1.Note.findOneAndUpdate({
            videoId: video._id,
        }, {
            videoId: video._id,
            notes: _allNotes
        }, { new: true, upsert: true });
    }
    else {
        const newNote = new mongo_1.Note({
            videoId: video._id,
            notes: _allNotes
        });
        yield newNote.save();
    }
    res.status(200).json({
        message: 'Notes updated',
        data: _allNotes
    });
    return;
}));
exports.getNote = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.cookies;
    const video = yield mongo_1.Video.findOne({
        youtubeId: req.params.youtubeId,
        userUUID: userId
    });
    if (video === null) {
        res.status(404).json({
            message: 'Video not found',
        });
        return;
    }
    const _note = yield mongo_1.Note.findOne({
        videoId: video._id,
    });
    res.status(200).json({
        data: (_note === null || _note === void 0 ? void 0 : _note.notes) || []
    });
    return;
}));
exports.deleteNote = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.cookies;
    const video = yield mongo_1.Video.findOne({
        youtubeId: req.params.youtubeId,
        userUUID: userId
    });
    if (video === null) {
        res.status(404).json({
            message: 'Video not found',
        });
        return;
    }
    const { from } = req.body;
    const _note = yield mongo_1.Note.findOne({
        videoId: video._id,
    });
    const hasNote = !!_note;
    let _allNotes = [];
    if (_note) {
        _allNotes = _note.notes;
    }
    _allNotes = _allNotes.filter(({ from: _from }) => _from !== from);
    if (hasNote) {
        yield mongo_1.Note.findOneAndUpdate({
            videoId: video._id,
        }, {
            videoId: video._id,
            notes: _allNotes
        }, { new: true, upsert: true });
    }
    res.status(200).json({
        message: 'Notes deleted',
        data: _allNotes
    });
    return;
}));
exports.importNote = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.cookies;
    const video = yield mongo_1.Video.findOne({
        youtubeId: req.params.youtubeId,
        userUUID: userId
    });
    if (video === null) {
        res.status(404).json({
            message: 'Video not found',
        });
        return;
    }
    const _note = yield mongo_1.Note.findOne({
        videoId: video._id,
    });
    res.status(200).json({
        data: (_note === null || _note === void 0 ? void 0 : _note.notes) || []
    });
    return;
}));
