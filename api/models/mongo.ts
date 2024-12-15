import mongoose, { Schema } from "mongoose";

export interface UserDoc {
    uuid: string,
    name: string,
    email: string
    googleId: string
    firstName: string
}


const UserSchema = new Schema<UserDoc>({
    uuid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    googleId: { type: String, required: true },
}, { timestamps: true })

const VideoSchema = new Schema({
    youtubeId: { type: String, required: true },
    customName: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    userUUID: { type: String, required: true },
}, { timestamps: true })

const IndividualNote = new Schema({
    from: { type: Number, required: true },
    text: { type: String, required: true, maxLength: 200 }
})

const NoteSchema = new Schema({
    videoId: { type: Schema.Types.ObjectId, ref: "Video" },
    notes: [IndividualNote]
}, { timestamps: true })

export const Video = mongoose.model("Video", VideoSchema, 'videos');
export const Note = mongoose.model("Note", NoteSchema, 'notes');
export const User = mongoose.model("User", UserSchema, 'users');

