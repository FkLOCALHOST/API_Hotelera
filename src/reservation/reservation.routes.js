import { Router } from "express";
import { getStatsGenerales, createReservation, getReservations, getReservationById, updateReservation, cancelReservation, completeReservation, searchReservations} from "./reservation.controller.js";
import {registerReservationValidator, getReservationByIdValidator, updateReservationValidator, deleteReservationValidator, searchReservationsValidator} from "../middlewares/reservation-validator.js";

const router = Router();

/**
 * @swagger
 * /reservation/createReservation:
 *   post:
 *     summary: Crear una nueva reservación
 *     tags:
 *       - Reservation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Reservación creada exitosamente
 */
router.post(
    "/createReservation",
    registerReservationValidator,
    createReservation
);

/**
 * @swagger
 * /reservation/getReservations:
 *   get:
 *     summary: Obtener todas las reservaciones
 *     tags:
 *       - Reservation
 *     responses:
 *       200:
 *         description: Lista de reservaciones
 */
router.get(
    "/getReservations",
    getReservations
);

/**
 * @swagger
 * /reservation/getReservationById/{uid}:
 *   get:
 *     summary: Obtener reservación por ID
 *     tags:
 *       - Reservation
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservación encontrada
 *       404:
 *         description: Reservación no encontrada
 */
router.get(
    "/getReservationById/:uid",
    getReservationByIdValidator,
    getReservationById
);

/**
 * @swagger
 * /reservation/updateReservation/{uid}:
 *   patch:
 *     summary: Actualizar reservación
 *     tags:
 *       - Reservation
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
 *         description: Reservación actualizada
 *       404:
 *         description: Reservación no encontrada
 */
router.patch(
    "/updateReservation/:uid",
    updateReservationValidator,
    updateReservation
);

/**
 * @swagger
 * /reservation/deleteReservation/{uid}:
 *   patch:
 *     summary: Cancelar reservación
 *     tags:
 *       - Reservation
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservación cancelada
 *       404:
 *         description: Reservación no encontrada
 */
router.patch(
    "/deleteReservation/:uid",
    deleteReservationValidator,
    cancelReservation
);

/**
 * @swagger
 * /reservation/completeReservation/{uid}:
 *   patch:
 *     summary: Completar reservación
 *     tags:
 *       - Reservation
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservación completada
 *       404:
 *         description: Reservación no encontrada
 */
router.patch(
    "/completeReservation/:uid",
    completeReservation
);

/**
 * @swagger
 * /reservation/searchReservations:
 *   get:
 *     summary: Buscar reservaciones
 *     tags:
 *       - Reservation
 *     responses:
 *       200:
 *         description: Reservaciones encontradas
 */
router.get(
    "/searchReservations",
    searchReservationsValidator,
    searchReservations
);

/**
 * @swagger
 * /reservation/getStatsGenerales:
 *   get:
 *     summary: Obtener estadísticas generales de reservaciones
 *     tags:
 *       - Reservation
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas generales obtenidas exitosamente
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: Acceso denegado, se requiere rol de administrador
 *     x-roles:
 *       - admin
 */
router.get(
    "/getStatsGenerales",
    getStatsGenerales
);

export default router;
