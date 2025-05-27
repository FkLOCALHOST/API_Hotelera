import { Router } from "express";
import { getAmenityById, createAmenity, getAmenity, deleteAmenity, updateAmenity } from "./amenity.controller.js";
import { getAmenityByIdValidator, registerAmenityValidator, deleteAmenityValidator, updateAmenityValidator } from "../middlewares/amenity-validator.js";

const router = Router();

/**
 * @swagger
 * /amenity/createAmenity:
 *   post:
 *     summary: Crear una nueva amenidad
 *     tags:
 *       - Amenity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Amenidad creada exitosamente
 */
router.post(
    "/createAmenity",
    registerAmenityValidator,
    createAmenity
)

/**
 * @swagger
 * /amenity/getAmenity:
 *   get:
 *     summary: Obtener todas las amenidades
 *     tags:
 *       - Amenity
 *     responses:
 *       200:
 *         description: Lista de amenidades
 */
router.get(
    "/getAmenity",
    getAmenity
)

/**
 * @swagger
 * /amenity/getAmenityById/{uid}:
 *   get:
 *     summary: Obtener amenidad por ID
 *     tags:
 *       - Amenity
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Amenidad encontrada
 *       404:
 *         description: Amenidad no encontrada
 */
router.get(
    "/getAmenityById/:uid",
    getAmenityByIdValidator,
    getAmenityById
)

/**
 * @swagger
 * /amenity/deleteAmenity/{uid}:
 *   patch:
 *     summary: Eliminar amenidad
 *     tags:
 *       - Amenity
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Amenidad eliminada
 *       404:
 *         description: Amenidad no encontrada
 */
router.patch(
    "/deleteAmenity/:uid",
    deleteAmenityValidator,
    deleteAmenity
)

/**
 * @swagger
 * /amenity/updateAmenity/{uid}:
 *   patch:
 *     summary: Actualizar amenidad
 *     tags:
 *       - Amenity
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
 *         description: Amenidad actualizada
 *       404:
 *         description: Amenidad no encontrada
 */
router.patch(
    "/updateAmenity/:uid",
    updateAmenityValidator,
    updateAmenity
)

export default router;