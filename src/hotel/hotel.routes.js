import { Router } from "express";
import { createHotel, getHotels, getHotelById, updateHotel, deleteHotel } from "./hotel.controller.js";
import { registerHotelValidator, getHotelByIdValidator, updateHotelValidator, deleteHotelValidator } from "../middlewares/hotel-validator.js";
import { uploadHotelPicture } from "../middlewares/multer-uploads.js";


const router = Router();

router.post(
    "/createHotel",
    uploadHotelPicture.single("imageHotel"),   
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

export default router;