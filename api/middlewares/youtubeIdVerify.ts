import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { config } from "dotenv";

config()

function removeHashtags(str = '') {
    return str.replace(/#\S+/g, "").trim();
}

export const youtubeIdVerify = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { youtubeId } = req.body

    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${youtubeId}&key=${process.env.YOUTUBE_API}`)
        const data = await response.json() as { items: any[] }
        console.log('youtubeIdVerify')
        if (response.status === 200 && data.items && data.items.length > 0) {
            console.log('youtubeIdVerify asasa')
            const item = data.items[0]
            res.locals.defaultName = removeHashtags(item.snippet.title)
            next()
            return;
        }
    } catch (err: unknown) {
        // no error handling
    }
    res.status(400).json({ message: 'Invalid youtube link' });
    return
})
