import {Router} from 'express';
import { login, register } from '../auth/auth.controller.js';
import { registerValidator , loginValidator} from '../middlewares/user-validator.js';
import { uploadProfilePicture } from '../middlewares/multer-uploads.js'; 
import { deleteFileOnError } from '../middlewares/delete-file-error.js';  

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 */
router.post(
    "/register", 
    uploadProfilePicture.single("profilePicture"),
    registerValidator, 
    deleteFileOnError,
    register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Usuario autenticado exitosamente
 *       401:
 *         description: Credenciales inválidas
 */
router.post(
    "/login",
    loginValidator,
    deleteFileOnError,
    login
)

export default router;