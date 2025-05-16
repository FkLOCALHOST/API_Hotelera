import { Router } from "express";
import { getAmenityById, createAmenity, getAmenity, deleteAmenity, updateAmenity } from "./amenity.controller.js";
import { getAmenityByIdValidator, registerAmenityValidator, deleteAmenityValidator, updateAmenityValidator } from "../middlewares/amenity-validator.js";

const router = Router();

router.post(
    "/createAmenity",
    registerAmenityValidator,
    createAmenity
)

router.get(
    "/getAmenity",
    getAmenity
)

router.get(
    "/getAmenityById/:uid",
    getAmenityByIdValidator,
    getAmenityById
)

router.patch(
    "/deleteAmenity/:uid",
    deleteAmenityValidator,
    deleteAmenity
)

router.patch(
    "/updateAmenity/:uid",
    updateAmenityValidator,
    updateAmenity
)

export default router;