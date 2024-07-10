import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // req.status(200).json({
    //     message: "ok"
    // })
    // get user details from frontend
    // validations as you like- not empty
    // check if user already exists- username, email
    // check for images, check for avatar
    // upload images to cloudinary
    // create user object - create entry in db
    // remove password and refresh token from the response
    // return resonse

    const { userName, email, fullName, password } = req.body

    const isValidUserName = (userName) => /^[a-zA-Z0-9_]+$/.test(userName);
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidFullName = (fullName) => /^[a-zA-Z\s]+$/.test(fullName);

    // console.log("Email: ", email);
    // console.log("Username: ", userName);

    // if (fullName === "") {
    //     throw new ApiError(400, "fullName is required")
    // } by this approach u have to check every field separately instead do this

    if (
        [fullName, email, userName, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    if (!isValidUserName(userName)) {
        throw new ApiError(400, "Username must only contain letters, numbers, and underscores");
    }

    if (!isValidEmail(email)) {
        throw new ApiError(400, "Invalid email format");
    }

    if (!isValidFullName(fullName)) {
        throw new ApiError(400, "Full name must only contain letters and spaces");
    }

    const existingUser =  await User.findOne({
        $or: [{ userName }, { email }]//this is operator just like normal AND OR
    })

    if (existingUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )  //this finds the user from the db and the select method takes the name of fiels that u dont want from db

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )

})

export { registerUser }