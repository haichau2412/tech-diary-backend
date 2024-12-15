import { Request, Response } from "express";
import { Video, Note, User } from "../../models/mongo";
import expressAsyncHandler from "express-async-handler";

export const updateVideoName = expressAsyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.cookies
    const { videoId } = req.params
    const { customName } = req.body

    await Video.findOneAndUpdate({
        videoId: videoId,
        userUUID: userId
    }, {
        customName
    }
    )

    res.status(200)
    return
})

export const getVideo = expressAsyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.cookies

    const videos = await Video.find({
        userUUID: userId
    })


    if (videos.length === 0) {
        res.status(204).json({
            data: []
        })
        return
    }

    res.status(200).json({
        data: videos.map(({ youtubeId, customName }) => ({
            youtubeId,
            customName
        }))
    })
    return
})

export const addVideo = expressAsyncHandler(async (req: Request, res: Response) => {

    try {
        const { userId } = req.cookies
        const { youtubeId, customName } = req.body
        const { defaultName } = res.locals


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
            const video = await Video.findOne({
                youtubeId,
                userUUID: userId
            })

            if (!video) {
                const newDoc = new Video({
                    youtubeId,
                    userId: user._id,
                    userUUID: user.uuid,
                    customName: customName || defaultName
                })
                await newDoc.save()
                res.location(`/api/videos/${youtubeId}`).status(201).json({
                    message: 'Resource created successfully'
                })
                return
            }

            res.status(409).json({
                success: false,
                message: 'Resource exists'
            })
            return
        }
        res.status(404).json({
            success: false,
            message: 'User id is not found',
        });
        return
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
})

//TODO: Implement backup feature
export const deleteVideo = expressAsyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.cookies
    const { videoId } = req.params

    const deletedItem = await Video.findOneAndDelete({
        userUUID: userId,
        youtubeId: videoId
    }, {
        projection: {
            _id: 1
        }
    }
    );


    if (deletedItem) {
        await Note.findOneAndDelete({
            videoId: deletedItem._id
        });
        res.status(200)
        return
    }

    res.status(204)
    return
})

export const addNote = expressAsyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.cookies



    const video = await Video.findOne({
        youtubeId: req.params.youtubeId,
        userUUID: userId
    })
    if (video === null) {
        res.status(404).json({
            message: 'Video not found',
        });
        return
    }

    const { from, text }: { from: number, text: string } = req.body


    const _note = await Note.findOne({
        videoId: video._id,
    })

    const hasNote = !!_note


    let _allNotes: { from: number, text: string }[] = []

    if (_note) {
        _allNotes = _note.notes
    }

    _allNotes = _allNotes.filter(({ from: _from }) => _from !== from)
    _allNotes.push({ from, text })
    console.log('result', from, text, _allNotes)

    if (hasNote) {
        await Note.findOneAndUpdate({
            videoId: video._id,
        }, {
            videoId: video._id,
            notes: _allNotes
        },
            { new: true, upsert: true }
        )

    } else {
        const newNote = new Note({
            videoId: video._id,
            notes: _allNotes
        })
        await newNote.save()
    }


    res.status(200).json({
        message: 'Notes updated',
        data: _allNotes
    });
    return
})

export const getNote = expressAsyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.cookies

    const video = await Video.findOne({
        youtubeId: req.params.youtubeId,
        userUUID: userId
    })

    if (video === null) {
        res.status(404).json({
            message: 'Video not found',
        });
        return
    }
    const _note = await Note.findOne({
        videoId: video._id,
    })

    res.status(200).json({
        data: _note?.notes || []
    });
    return
})

export const deleteNote = expressAsyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.cookies

    const video = await Video.findOne({
        youtubeId: req.params.youtubeId,
        userUUID: userId
    })

    if (video === null) {
        res.status(404).json({
            message: 'Video not found',
        });
        return
    }

    const { from }: { from: number, text: string } = req.body


    const _note = await Note.findOne({
        videoId: video._id,
    })

    const hasNote = !!_note


    let _allNotes: { from: number, text: string }[] = []

    if (_note) {
        _allNotes = _note.notes
    }

    _allNotes = _allNotes.filter(({ from: _from }) => _from !== from)

    if (hasNote) {
        await Note.findOneAndUpdate({
            videoId: video._id,
        }, {
            videoId: video._id,
            notes: _allNotes
        },
            { new: true, upsert: true }
        )

    }

    res.status(200).json({
        message: 'Notes deleted',
        data: _allNotes
    });
    return
})

export const importNote = expressAsyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.cookies

    const video = await Video.findOne({
        youtubeId: req.params.youtubeId,
        userUUID: userId
    })

    if (video === null) {
        res.status(404).json({
            message: 'Video not found',
        });
        return
    }
    const _note = await Note.findOne({
        videoId: video._id,
    })

    res.status(200).json({
        data: _note?.notes || []
    });
    return
})