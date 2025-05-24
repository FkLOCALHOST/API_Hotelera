import {Router} from 'express'
import { createEvent, getEvents, updateEvent, deleteEvent, searchEvent } from './event.controller.js'
import { createEventValidator, updateEventValidator, deleteEventValidator, searchEventValidator } from "../middlewares/event-validator.js"
import { uploadEventPicture } from '../middlewares/multer-uploads.js'
import { deleteFileOnError } from '../middlewares/delete-file-error.js'


const router = Router()

/**
 * @swagger
 * /event/createEvent:
 *   post:
 *     summary: Crear un nuevo evento
 *     tags:
 *       - Event
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Evento creado exitosamente
 */
router.post(
    "/createEvent",
    uploadEventPicture.single("image"),
    createEventValidator,
    deleteFileOnError,
    createEvent
)

/**
 * @swagger
 * /event/getEvents:
 *   get:
 *     summary: Obtener todos los eventos
 *     tags:
 *       - Event
 *     responses:
 *       200:
 *         description: Lista de eventos
 */
router.get(
    "/getEvents",
    getEvents
)

/**
 * @swagger
 * /event/updateEvent/{eid}:
 *   put:
 *     summary: Actualizar evento
 *     tags:
 *       - Event
 *     parameters:
 *       - in: path
 *         name: eid
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
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Evento actualizado
 *       404:
 *         description: Evento no encontrado
 */
router.put(
    "/updateEvent/:eid",
    uploadEventPicture.single("image"),
    updateEventValidator,
    deleteFileOnError,
    updateEvent
)

/**
 * @swagger
 * /event/deleteEvent/{eid}:
 *   delete:
 *     summary: Eliminar evento
 *     tags:
 *       - Event
 *     parameters:
 *       - in: path
 *         name: eid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento eliminado
 *       404:
 *         description: Evento no encontrado
 */
router.delete(
    "/deleteEvent/:eid",
    deleteEventValidator,
    deleteEvent
)

router.get(
    "/searchEvent",
    searchEventValidator,
    searchEvent
)

export default router