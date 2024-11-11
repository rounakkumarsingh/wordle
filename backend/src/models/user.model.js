import { Schema, model } from "mongoose";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - username
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         fullName:
 *           type: string
 *           description: The full name of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *         username:
 *           type: string
 *           description: The username chosen by the user
 *         password:
 *           type: string
 *           description: The password for the user account
 *         profilePicture:
 *           type: string
 *           description: URL of the profile picture
 *         refreshToken:
 *           type: string
 *           description: The refresh token for the user
 *         games:
 *           type: array
 *           items:
 *             type: string
 *           description: List of game IDs associated with the user
 *         statsUsingPrivate:
 *           type: boolean
 *           description: Indicates if the user's stats are private
 *       example:
 *         id: d5fE_asz
 *         fullName: John Doe
 *         email: john.doe@example.com
 *         username: johndoe
 *         password: password123
 *         profilePicture: http://example.com/profile.jpg
 *         refreshToken: null
 *         games: []
 *         statsUsingPrivate: false
 */
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        profilePicture: {
            type: String, // Cloudinary url
            required: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        refreshToken: {
            type: String,
            default: null,
        },
        games: [
            {
                type: Schema.Types.ObjectId,
                ref: "Game",
            },
        ],
        statsUsingPrivate: {
            type: Boolean,
            default: false,
            required: true,
        },
    },
    { timestamps: true }
);

userSchema.plugin(aggregatePaginate);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
            profilePicture: this.profilePicture,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

const User = model("User", userSchema);

export default User;
