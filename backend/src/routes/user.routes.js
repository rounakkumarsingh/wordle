import { Router } from "express";
import {
    changeCurrentPassword,
    findUser,
    getCurrentUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    updateAccountDetails,
    updateProfilePicture,
    deleteProfilePicture,
} from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("profile-picture"), registerUser);
router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router
    .route("/update-profile-picture")
    .patch(verifyJWT, upload.single("profile-picture"), updateProfilePicture);
router.route("/remove-profile-picture").delete(verifyJWT, deleteProfilePicture);
router.route("/:username").get(findUser);

const userRouter = router;
export default userRouter;
