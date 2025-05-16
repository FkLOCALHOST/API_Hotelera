import { body , param} from "express-validator";
import { uidAmenityExist} from "../helpers/db-validators.js";
import { validationsFields } from "./validatorsFields.js";
import { validateJWT } from "./validate-token.js";
import { hasRoles } from "./validate-role.js";
import { catchErrors } from "./catch-errors.js";

export const registerAmenityValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    body("name").not().isEmpty().withMessage("Name is required"),
    body("description").not().isEmpty().withMessage("Description is required"),
    body("price").not().isEmpty().withMessage("price is required"),
    validationsFields,
    catchErrors  
];

export const getAmenityByIdValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid").isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("uid").custom(uidAmenityExist),
    validationsFields,
    catchErrors
]

export const deleteAmenityValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid").isMongoId().withMessage("No es un ID válido de MongoDB").custom(uidAmenityExist),
    validationsFields,
    catchErrors
]

export const updateAmenityValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid", "No es un ID válido").isMongoId().custom(uidAmenityExist),
    validationsFields,
    catchErrors
]