import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body
    const owner = req.user._id

    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    const tweet = new Tweet({ content, owner })
    await tweet.save()

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tweet,
                "Tweet created successfully"
            )
        )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userId = req.user._id

    const tweets = await Tweet.find({ owner: userId }).populate("owner", "userName email")

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tweets,
                "Tweets retrieved successfully"
            )
        )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params
    const { content } = req.body

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet Id")
    }

    const tweet = await Tweet.findById(tweetId)
    if (!tweet) {
        throw new ApiError(404, "Tweet now found")
    }
    if (!tweet.owner.equals(req.user._id)) {
        throw new ApiError(403, "Unauthorized to update this tweet")
    }

    tweet.content = content || tweet.content
    await tweet.save()

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tweet,
                "Tweet updated successfully"
            )
        )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params

    if (!isValidObjectId(tweet)) {
        throw new ApiError(400, "Invalid tweet Id")
    }

    const tweet = await Tweet.findById(tweetId)
    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }
    if (!tweet.owner.equals(req.user._id)) {
        throw new ApiError(403, "Unauthorized to delete this tweet")
    }

    await tweet.remove()
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tweet,
                "Tweet deleted successfully"
            )
        )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
