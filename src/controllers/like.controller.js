import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: toggle like on video
    const { userId } = req.body

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const existingLike = await Like.findOne({ video: videoId, user: userId })

    if (existingLike) {
        await existingLike.remove()
        return res
            .status(200)
            .json(
                new ApiResponse(200, "Video unliked successfully")
            )
    } else {
        const like = new Like({ video: videoId, user: userId })
        await like.save()
        return res
            .status(200)
            .json(
                new ApiResponse(201, like, "Video liked successfully")
            )
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    //TODO: toggle like on comment
    const { userId } = req.body

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment Id")
    }

    const existingLike = await Like.findOne({ comment: commentId, user: userId })

    if (existingLike) {
        await existingLike.remove()
        return res
            .status(200)
            .json(
                new ApiResponse(200, "Comment unliked successfully")
            )
    } else {
        const like = new Like({ comment: commentId, user: userId })
        await like.save()
        return res
            .status(200)
            .json(
                new ApiResponse(201, like, "Comment liked successfully")
            )
    }


})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    //TODO: toggle like on tweet
    const { userId } = req.body

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet Id")
    }

    const existingLike = await Like.findOne({ tweet: tweetId, user: userId })

    if (existingLike) {
        await existingLike.remove()
        return res
            .status(200)
            .json(
                new ApiResponse(200, "Tweet unliked successfully")
            )
    } else {
        const like = new Like({ tweet: tweetId, user: userId })
        await like.save()
        return res
            .status(200)
            .json(
                new ApiResponse(201, like, "Tweet liked successfully")
            )
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const { userId } = req.body

    const likedVideos = await Like.find(
        {
            user: userId, video: { $exists: true }
        }
    ).populate('video')

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Liked videos retrieved successfully",
                likedVideos
            )
        )

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}