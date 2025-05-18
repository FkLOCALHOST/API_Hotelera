import { Router } from "express";
import { createRoom ,getRoomById ,getRooms ,updateRoom , deleteRoom } from "./room.controller.js";

import {registerRoomValidator, getRoomByIdValidator, updateRoomValidator, deleteRoomValidator} from "../middlewares/room-validator.js";

import { uploadRoomPicture } from "../middlewares/multer-uploads.js";

const router = Router();

router.post(
    "/createRoom",
    uploadRoomPicture.single("preView"),
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

export default router;
