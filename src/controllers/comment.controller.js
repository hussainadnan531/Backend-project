import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    const options = {
        page: Number(page),
        limit: Number(limit),
        sort: { createdAt: - 1 }
    }

    const aggregateQuery = Comment.aggregate(
        [
            {
                $match: {
                    video: mongoose.Types.ObjectId(videoId)
                }
            }
        ]
    )

    const comments = await Comment.aggregarePaginate(aggregateQuery, options)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                comments,
                "Comments retrieved successfully"
            )
        )

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params
    const { userId, content } = req.body

    const comment = new Comment(
        {
            video: videoId,
            owner: userId,
            content
        }
    )

    await comment.save()

    return res
        .status(200)
        .json(
            new ApiResponse(200, comment, "Commemt added successfully")
        )

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params
    const { content } = req.body

    const comment = await Comment.findByIdAndUpdate(
        commentId,
        { content },
        { new: true, runValidators: true }
    )

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                comment,
                "Comment updated successfully"
            )
        )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params

    const comment = await Comment.findByIdAndDelete(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Comment deleted successfully")
        )
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}
