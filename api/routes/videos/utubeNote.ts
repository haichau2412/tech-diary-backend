import { Router, Request, Response, NextFunction } from "express";
import { Video, Note, User } from "../../models/video";
import expressAsyncHandler from "express-async-handler";
import { verifyAccessToken, verifyRefreshToken } from "../../libs/token";

const router = Router();

router.get("/videos/:youtubeId", expressAsyncHandler(async (req: Request , res: Response, next: NextFunction) => {

    // if (!token) {
    //     res.status(401).json({ message: 'Unauthorized' });
    //     return
    // }

    return


    const video = await Video.findOne({
        youtubeId: req.params.youtubeId
    }).exec()

    if (video === null) {
        const err = new Error("Video not found");
        res.status(404).json({
            status: false,
            message: err.message,
        });
        return
    }

    res.status(200).json({
        status: true,
        data: 'haha',
    });
}))

router.post("/api/videos/", expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { youtubeId, customName, userId } = req.body

        if (!youtubeId) {
            res.status(400).json({
                success: false,
                message: 'Title and content are required.',
            });
            return
        }

        const user = await User.findOne({
            uuid: userId
        })

        if (user) {
            const video = await Video.find({
                youtubeId
            })

            if (video.length === 0) {
                const newDoc = new Video({
                    youtubeId,
                    userId: user._id,
                    userUUID: user.uuid,
                    customName
                })
                await newDoc.save()
                res.location(`/api/videos/${youtubeId}`).status(201).json({
                    success: true,
                    message: 'Resource created successfully'
                })
                return
            }
        }

        res.location(`/api/videos/${youtubeId}`).status(409).json({
            success: false,
            message: 'Resource exist'
        })
        return
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ success: false, message: 'Server error' });
    }
}))

router.get("/api/videos/:youtubeId/notes", expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const video = await Video.findOne({
        youtubeId: req.params.youtubeId
    }).exec()

    if (video === null) {
        const err = new Error("Video not found");
        res.status(404).json({
            status: false,
            message: err.message,
        });
        return
    }

    res.status(200).json({
        status: true,
        data: 'haha',
    });
}))

router.post("/api/videos/:youtubeId/notes", expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const video = await Video.findOne({
        youtubeId: req.params.youtubeId
    }).exec()

    if (video === null) {
        const err = new Error("Video not found");
        res.status(404).json({
            status: false,
            message: err.message,
        });
        return
    }

    res.status(200).json({
        status: true,
        data: 'haha',
    });
}))

router.put("/api/videos/:youtubeId/notes/:noteId", expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const video = await Video.findOne({
        youtubeId: req.params.youtubeId
    }).exec()

    if (video === null) {
        const err = new Error("Video not found");
        res.status(404).json({
            status: false,
            message: err.message,
        });
        return
    }

    res.status(200).json({
        status: true,
        data: 'haha',
    });
}))



export default router