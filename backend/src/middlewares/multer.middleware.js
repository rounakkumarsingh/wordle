import multer from "multer";

/**
 * @swagger
 * components:
 *   requestBodies:
 *     ProfilePicture:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profile-picture:
 *                 type: string
 *                 format: binary
 */

const storage = multer.diskStorage({
    destination: function (_, __, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.originalname + "-" + uniqueSuffix);
    },
});

const upload = multer({ storage });
export default upload;
