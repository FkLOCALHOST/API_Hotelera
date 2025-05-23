import { Router } from "express";
import { createRoom ,getRoomById ,getRooms ,updateRoom , deleteRoom, addAmenity, uploadRoomImages, searchRooms, verifyRoom} from "./room.controller.js";
import {registerRoomValidator, getRoomByIdValidator, updateRoomValidator, deleteRoomValidator, searchRoomsValidator} from "../middlewares/room-validator.js";
import { uploadRoomPicture } from "../middlewares/multer-uploads.js";

const router = Router();

router.post(
    "/createRoom",
    uploadRoomPicture.array("preView", 5), 
    registerRoomValidator,
    createRoom
);


router.get(
    "/getRooms",
    getRooms
);

router.get(
    "/getRoomById/:uid",
    getRoomByIdValidator,
    getRoomById
);

router.patch(
    "/updateRoom/:uid",
    uploadRoomPicture.single("preView"),
    updateRoomValidator,
    updateRoom
);

router.patch(
    "/deleteRoom/:uid",
    deleteRoomValidator,
    deleteRoom
);

router.patch(
    "/addAmenity/:uid",
    addAmenity
);

router.patch(
    "/uploadRoomImage/:uid",
    uploadRoomPicture.array("newImages", 5), 
    uploadRoomImages
);

router.get(
    '/searchRooms',
    searchRoomsValidator,
    searchRooms
)

router.get(
    "/verifyRoom/:uid",
    verifyRoom
)

export default router;
