import express from "express"
import { v2 as cloudinary } from 'cloudinary';
import { uploadProfilePicture } from "./multer.js"
import fs from "fs/promises"
import path from "path"


const router = express.Router()

cloudinary.config({
    cloud_name: 'djqjmyuoc',
    api_key: process.env.API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

router.post("/upload/profile", uploadProfilePicture.single("image"), async (req, res) => {
    try {
        const localFilePath = path.join(req.filePath, req.file.filename)

        const result = await cloudinary.uploader.upload(localFilePath, {
            folder: "profiles",
        })

        await fs.unlink(localFilePath)

        res.json({
            message: "Imagen subida exitosamente",
            url: result.secure_url,
            public_id: result.public_id,
        })
    } catch (error) {
        console.error("Error al subir imagen:", error)
        res.status(500).json({ error: "Error al subir imagen" })
    }
})

export default router
