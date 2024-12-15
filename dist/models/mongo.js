"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Note = exports.Video = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    uuid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    googleId: { type: String, required: true },
}, { timestamps: true });
const VideoSchema = new mongoose_1.Schema({
    youtubeId: { type: String, required: true },
    customName: { type: String },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    userUUID: { type: String, required: true },
}, { timestamps: true });
const IndividualNote = new mongoose_1.Schema({
    from: { type: Number, required: true },
    text: { type: String, required: true, maxLength: 200 }
});
const NoteSchema = new mongoose_1.Schema({
    videoId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Video" },
    notes: [IndividualNote]
}, { timestamps: true });
exports.Video = mongoose_1.default.model("Video", VideoSchema, 'videos');
exports.Note = mongoose_1.default.model("Note", NoteSchema, 'notes');
exports.User = mongoose_1.default.model("User", UserSchema, 'users');