import { Router } from "express";
import { createRoom ,getRoomById ,getRooms ,updateRoom , deleteRoom, addAmenity, uploadRoomImages, searchRooms, verifyRoom} from "./room.controller.js";
import {registerRoomValidator, getRoomByIdValidator, updateRoomValidator, deleteRoomValidator, searchRoomsValidator} from "../middlewares/room-validator.js";
import { uploadRoomPicture } from "../middlewares/multer-uploads.js";

const router = Router();

/**
 * @swagger
 * /room/createRoom:
 *   post:
 *     summary: Crear una nueva habitación
 *     tags:
 *       - Room
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               preView:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Habitación creada exitosamente
 */
router.post(
    "/createRoom",
    uploadRoomPicture.array("preView", 5), 
    registerRoomValidator,
    createRoom
);

/**
 * @swagger
 * /room/getRooms:
 *   get:
 *     summary: Obtener todas las habitaciones
 *     tags:
 *       - Room
 *     responses:
 *       200:
 *         description: Lista de habitaciones
 */
router.get(
    "/getRooms",
    getRooms
);

/**
 * @swagger
 * /room/getRoomById/{uid}:
 *   get:
 *     summary: Obtener habitación por ID
 *     tags:
 *       - Room
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Habitación encontrada
 *       404:
 *         description: Habitación no encontrada
 */
router.get(
    "/getRoomById/:uid",
    getRoomByIdValidator,
    getRoomById
);

/**
 * @swagger
 * /room/updateRoom/{uid}:
 *   patch:
 *     summary: Actualizar habitación
 *     tags:
 *       - Room
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               preView:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Habitación actualizada
 *       404:
 *         description: Habitación no encontrada
 */
router.patch(
    "/updateRoom/:uid",
    uploadRoomPicture.single("preView"),
    updateRoomValidator,
    updateRoom
);

/**
 * @swagger
 * /room/deleteRoom/{uid}:
 *   patch:
 *     summary: Eliminar habitación
 *     tags:
 *       - Room
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Habitación eliminada
 *       404:
 *         description: Habitación no encontrada
 */
router.patch(
    "/deleteRoom/:uid",
    deleteRoomValidator,
    deleteRoom
);

/**
 * @swagger
 * /room/addAmenity/{uid}:
 *   patch:
 *     summary: Agregar amenidad a la habitación
 *     tags:
 *       - Room
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Amenidad agregada
 *       404:
 *         description: Habitación no encontrada
 */
router.patch(
    "/addAmenity/:uid",
    addAmenity
);

/**
 * @swagger
 * /room/uploadRoomImage/{uid}:
 *   patch:
 *     summary: Subir imágenes a la habitación
 *     tags:
 *       - Room
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               newImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Imágenes subidas
 *       404:
 *         description: Habitación no encontrada
 */
router.patch(
    "/uploadRoomImage/:uid",
    uploadRoomPicture.array("newImages", 5), 
    uploadRoomImages
);

/**
 * @swagger
 * /room/searchRooms:
 *   get:
 *     summary: Buscar habitaciones
 *     tags:
 *       - Room
 *     responses:
 *       200:
 *         description: Habitaciones encontradas
 */
router.get(
    '/searchRooms',
    searchRoomsValidator,
    searchRooms
)

/**
 * @swagger
 * /room/verifyRoom/{uid}:
 *   get:
 *     summary: Verificar habitación por ID
 *     tags:
 *       - Room
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Habitación verificada
 *       404:
 *         description: Habitación no encontrada
 */
router.get(
    "/verifyRoom/:uid",
    verifyRoom
)

export default router;
