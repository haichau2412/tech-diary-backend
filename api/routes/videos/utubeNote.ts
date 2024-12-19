import { Router } from "express";
import { verifyTokenMW } from "../../middlewares/tokenVerify";
import { getVideo, getNote, addNote, addVideo, deleteVideo, deleteNote, updateVideoName, verifyVideo } from "../../controller/utubeNote/video";
import { youtubeIdVerify } from "../../middlewares/youtubeIdVerify";

const router = Router();

router.post("/api/importUtubeNote", verifyTokenMW, getVideo)

router.get("/api/videos", verifyTokenMW, getVideo)

router.post("/api/videos", verifyTokenMW, youtubeIdVerify, addVideo)

router.delete("/api/videos/:videoId", verifyTokenMW, deleteVideo)

router.patch("/api/videos/:videoId", verifyTokenMW, updateVideoName)

router.delete("/api/videos", verifyTokenMW, youtubeIdVerify, addVideo)

router.get("/api/notes/:youtubeId", verifyTokenMW, getNote)

router.post("/api/notes/:youtubeId", verifyTokenMW, addNote)

router.post("/api/notes/:youtubeId/:noteId", verifyTokenMW, deleteNote)

router.post("/verifyVideo", youtubeIdVerify, verifyVideo)


export default router