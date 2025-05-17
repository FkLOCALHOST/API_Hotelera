import { Router } from "express";
import { createHotel, getHotels, getHotelById, updateHotel, deleteHotel} from "./hotel.controller.js";
import { registerHotelValidator, getHotelByIdValidator, updateHotelValidator, deleteHotelValidator} from "../middlewares/hotel-validator.js";

const router = Router();

/**
 * @swagger
 * /hotel/createHotel:
 *   post:
 *     summary: Crear un nuevo hotel
 *     tags:
 *       - Hotel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Hotel creado exitosamente
 */
router.post(
    "/createHotel",
    registerHotelValidator,
    createHotel
);

/**
 * @swagger
 * /hotel/getHotels:
 *   get:
 *     summary: Obtener todos los hoteles
 *     tags:
 *       - Hotel
 *     responses:
 *       200:
 *         description: Lista de hoteles
 */
router.get(
    "/getHotels",
    getHotels
);

/**
 * @swagger
 * /hotel/getHotelById/{uid}:
 *   get:
 *     summary: Obtener hotel por ID
 *     tags:
 *       - Hotel
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hotel encontrado
 *       404:
 *         description: Hotel no encontrado
 */
router.get(
    "/getHotelById/:uid",
    getHotelByIdValidator,
    getHotelById
);

/**
 * @swagger
 * /hotel/updateHotel/{uid}:
 *   patch:
 *     summary: Actualizar hotel
 *     tags:
 *       - Hotel
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Hotel actualizado
 *       404:
 *         description: Hotel no encontrado
 */
router.patch(
    "/updateHotel/:uid",
    updateHotelValidator,
    updateHotel
);

/**
 * @swagger
 * /hotel/deleteHotel/{uid}:
 *   patch:
 *     summary: Eliminar hotel
 *     tags:
 *       - Hotel
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hotel eliminado
 *       404:
 *         description: Hotel no encontrado
 */
router.patch(
    "/deleteHotel/:uid",
    deleteHotelValidator,
    deleteHotel
);

export default router;