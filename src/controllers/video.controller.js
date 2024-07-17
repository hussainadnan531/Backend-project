import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const match = {
        ...(query && { $text: { $search: query } }),
        ...(userId && { owner: userId })
    };

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { [sortBy]: sortType === "asc" ? 1 : -1 }
    };

    const videos = await Video.aggregatePaginate(Video.aggregate().match(match), options);
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Videos retrieved successfully",
                videos
            )
        )

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video
    const owner = req.user._id

    if (!req.files || !req.files.video || !req.files.thumbnail) {
        throw new ApiError(400, "Video file and thumbnail are required")
    }

    const videoFile = req.files.video
    const thumbnail = req.files.thumbnail

    const videoUpload = await uploadOnCloudinary(videoFile.path)
    const thumbnailUpload = await uploadOnCloudinary(thumbnail.path)

    const video = new Video({
        title,
        description,
        videoFile: videoUpload.url,
        thumbnail: thumbnailUpload.url,
        duration: videoUpload.duration,
        owner
    })

    await video.save()
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                "Video published successfully",
                video
            )
        )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid video ID')
    }

    const video = await Video.findById(videoId).populate('owner', 'username email')
    if (!video) {
        throw new ApiError(404, 'Video not found')
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200, "Video retrieved successfully",
                video
            )
        )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid video ID')
    }

    const video = await Video.findById(videoId).populate('owner', 'username email')
    if (!video) {
        throw new ApiError(404, 'Video not found')
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200, "Video retrieved successfully",
                video
            )
        )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid video ID')
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, 'Video not found')
    }

    if (!video.owner.equals(req.user._id)) {
        throw new ApiError(403, 'Unauthorized to delete this video')
    }

    await video.remove()
    return res
        .status(200)
        .json(
            new ApiResponse(
                200, "Video deleted successfully"
            )
        )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid video ID')
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, 'Video not found')
    }

    if (!video.owner.equals(req.user._id)) {
        throw new ApiError(403, 'Unauthorized to update this video')
    }

    video.isPublished = !video.isPublished
    await video.save()

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Video publish status updated successfully",
                video
            )
        )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
