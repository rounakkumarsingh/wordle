import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ApiError from "./ApiError.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null;
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        // console.log("File is uplaoded on cloudinary: ", response.url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
    }
};

const deleteFromCloudinary = async (pathsOnCloudinary) => {
    try {
        if (!pathsOnCloudinary) {
            return null;
        }

        const paths = Array.isArray(pathsOnCloudinary)
            ? pathsOnCloudinary
            : [pathsOnCloudinary];

        for (const path of paths) {
            const publicId = path.split("/").pop().split(".")[0];
            return await cloudinary.uploader.destroy(publicId);
        }
    } catch (error) {
        throw new ApiError(500, "Error deleting file from cloudinary");
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };
