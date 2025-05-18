import { Router } from "express";
import {createReservation, getReservations, getReservationById, updateReservation, cancelReservation, completeReservation} from "./reservation.controller.js";
import {registerReservationValidator, getReservationByIdValidator, updateReservationValidator, deleteReservationValidator} from "../middlewares/reservation-validator.js";

const router = Router();

router.post(
    "/createReservation",
    registerReservationValidator,
    createReservation
);

router.get(
    "/getReservations",
    getReservations
);

router.get(
    "/getReservationById/:uid",
    getReservationByIdValidator,
    getReservationById
);

router.patch(
    "/updateReservation/:uid",
    updateReservationValidator,
    updateReservation
);

router.patch(
    "/deleteReservation/:uid",
    deleteReservationValidator,
    cancelReservation
);

router.patch(
    "/completeReservation/:uid",
    completeReservation
)

export default router;
