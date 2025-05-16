import { Router } from "express"
import { getUserById, getUsers, deleteUser, updatePassword, updateUser, updateProfilePicture} from "./user.controller.js"
import { getUserByIdValidator, deleteUserValidator, updatePasswordValidator, updateUserValidator , UpdateProfileValidator } from "../middlewares/user-validator.js"
import { uploadProfilePicture } from "../middlewares/multer-uploads.js"
import { validateJWT } from "../middlewares/validate-token.js"
import { hasRoles } from "../middlewares/validate-role.js"

const router = Router()

/**
 * @swagger
 * /findUser/{uid}:
 *   get:
 *     summary: Obtener usuario por ID
 *     description: Obtiene la información de un usuario utilizando su ID.
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: ID del usuario.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get(
    "/findUser/:uid",
    getUserByIdValidator,
    getUserById
);

/**
 * @swagger
 * /findUser/:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Obtiene la lista de todos los usuarios.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       403:
 *         description: No autorizado (requiere rol de ADMIN)
 */
router.get(
    "/findUser/",
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    getUsers
);

/**
 * @swagger
 * /deleteUser/{uid}:
 *   patch:
 *     summary: Eliminar usuario
 *     description: Elimina un usuario por su ID.
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: ID del usuario a eliminar.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 */
router.patch(
    "/deleteUser/:uid", 
    deleteUserValidator, 
    deleteUser
);


/**
 * @swagger
 * /updatePassword/{uid}:
 *   patch:
 *     summary: Actualizar contraseña de usuario
 *     description: Actualiza la contraseña de un usuario por su ID.
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: ID del usuario.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 *       404:
 *         description: Usuario no encontrado
 */
router.patch(
    "/updatePassword/:uid", 
    updatePasswordValidator, 
    updatePassword
);

/**
 * @swagger
 * /updateUser/{uid}:
 *   put:
 *     summary: Actualizar usuario
 *     description: Actualiza la información de un usuario por su ID.
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: ID del usuario.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       404:
 *         description: Usuario no encontrado
 */
router.put(
    "/updateUser/:uid", 
    updateUserValidator, 
    updateUser
);

/**
 * @swagger
 * /updatePictureProfile/{uid}:
 *   patch:
 *     summary: Actualizar foto de perfil de usuario
 *     description: Actualiza la foto de perfil de un usuario por su ID.
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: ID del usuario.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Foto de perfil actualizada
 *       404:
 *         description: Usuario no encontrado
 */
router.patch(
    "/updatePictureProfile/:uid", 
    uploadProfilePicture.single("newProfilePicture"),
    UpdateProfileValidator, 
    updateProfilePicture
);

export default router;
