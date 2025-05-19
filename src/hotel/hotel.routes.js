import { Router } from "express";
import { createHotel, getHotels, getHotelById, updateHotel, deleteHotel, searchHotels } from "./hotel.controller.js";
import { registerHotelValidator, getHotelByIdValidator, updateHotelValidator, deleteHotelValidator, searchHotelsValidator } from "../middlewares/hotel-validator.js";

const router = Router();

router.post(
    "/createHotel",
    registerHotelValidator,
    createHotel
);

router.get(
    "/getHotels",
    getHotels
);

router.get(
    "/getHotelById/:uid",
    getHotelByIdValidator,
    getHotelById
);

router.patch(
    "/updateHotel/:uid",
    updateHotelValidator,
    updateHotel
);

router.patch(
    "/deleteHotel/:uid",
    deleteHotelValidator,
    deleteHotel
);

router.get(
    "/searchHotels",
    searchHotelsValidator,
    searchHotels
);

export default router;