import mongoose from "mongoose";

mongoose.set("strictQuery", false)

const mongoDB = "mongodb+srv://chau96cc:bubtjH3YwlxKEAGG@cluster0.o9pfd.mongodb.net/Utube?retryWrites=true&w=majority&appName=Cluster0"

export async function main() {
    await mongoose.connect(mongoDB)
}