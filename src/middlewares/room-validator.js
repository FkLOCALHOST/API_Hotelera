import { body, param } from "express-validator";
import { uidHotelExist, uidRoomExist } from "../helpers/db-validators.js";
import { validationsFields } from "./validatorsFields.js";
import { validateJWT } from "./validate-token.js";
import { hasRoles } from "./validate-role.js";
import { catchErrors } from "./catch-errors.js";
import { deleteFileOnError } from "./delete-file-error.js";

export const registerRoomValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    body("number").not().isEmpty().withMessage("Number is required"),
    body("description").not().isEmpty().withMessage("Description is required"),
    body("price").not().isEmpty().withMessage("Price is required"),
    body("capacity").not().isEmpty().withMessage("Capacity is required"),
    body("hotel").not().isEmpty().withMessage("Hotel ID is required").isMongoId().withMessage("Hotel ID must be a valid Mongo ID").custom(uidHotelExist),
    validationsFields,
    deleteFileOnError,
    catchErrors
];

export const getRoomByIdValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid").isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("uid").custom(uidRoomExist),
    validationsFields,
    catchErrors
];

export const deleteRoomValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid").isMongoId().withMessage("No es un ID válido de MongoDB").custom(uidRoomExist),
    validationsFields,
    catchErrors
];

export const updateRoomValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid", "No es un ID válido").isMongoId().custom(uidRoomExist),
    validationsFields,
    catchErrors
];
