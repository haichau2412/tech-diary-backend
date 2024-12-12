import mongoose from "mongoose";
import { config } from "dotenv";

config()

mongoose.set("strictQuery", false)

const mongoDB = `mongodb+srv://chau96cc:${process.env.PRIVATEMONGO}@cluster0.o9pfd.mongodb.net/Utube?retryWrites=true&w=majority&appName=Cluster0`

export async function main() {
    await mongoose.connect(mongoDB)
}