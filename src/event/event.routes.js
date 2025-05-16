import {Router} from 'express'
import { createEvent, getEvents, updateEvent, deleteEvent, searchEvent } from './event.controller.js'
import { createEventValidator, updateEventValidator, deleteEventValidator, searchEventValidator } from "../middlewares/event-validator.js"
import { uploadEventPicture } from '../middlewares/multer-uploads.js'
import { deleteFileOnError } from '../middlewares/delete-file-error.js'


const router = Router()

router.post(
    "/createEvent",
    uploadEventPicture.single("image"),
    createEventValidator,
    deleteFileOnError,
    createEvent
)

router.get(
    "/getEvents",
    getEvents
)

router.put(
    "/updateEvent/:eid",
    uploadEventPicture.single("image"),
    updateEventValidator,
    deleteFileOnError,
    updateEvent
)

router.delete(
    "/deleteEvent/:eid",
    deleteEventValidator,
    deleteEvent
)

router.get(
    "/searchEvent/:name",
    searchEventValidator,
    searchEvent
)



export default router