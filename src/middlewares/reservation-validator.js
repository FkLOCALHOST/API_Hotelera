import { body, param } from "express-validator";
import { uidReservationExist } from "../helpers/db-validators.js";
import { validationsFields } from "./validatorsFields.js";
import { validateJWT } from "./validate-token.js";
import { hasRoles } from "./validate-role.js";
import { catchErrors } from "./catch-errors.js";

export const registerReservationValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "USER_ROLE"),
    body("user").not().isEmpty().withMessage("El ID del usuario es obligatorio").isMongoId(),
    body("checkIn").not().isEmpty().withMessage("La fecha de entrada es obligatoria").isISO8601(),
    body("checkOut").not().isEmpty().withMessage("La fecha de salida es obligatoria").isISO8601(),
    body("room").not().isEmpty().withMessage("El número o nombre de la habitación es obligatorio"),
    body("status").optional().isIn(["PENDING", "COMPLETED", "CANCELLED"]),
    validationsFields,
    catchErrors
];

export const getReservationByIdValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid").isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("uid").custom(uidReservationExist),
    validationsFields,
    catchErrors
];

export const deleteReservationValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid").isMongoId().withMessage("No es un ID válido de MongoDB").custom(uidReservationExist),
    validationsFields,
    catchErrors
];

export const updateReservationValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid").isMongoId().withMessage("No es un ID válido de MongoDB").custom(uidReservationExist),
    body("checkIn").optional().isISO8601().withMessage("Fecha inválida"),
    body("checkOut").optional().isISO8601().withMessage("Fecha inválida"),
    body("room").optional().not().isEmpty().withMessage("El campo room no puede ir vacío"),
    body("status").optional().isIn(["PENDING", "COMPLETED", "CANCELLED"]),
    validationsFields,
    catchErrors
];
