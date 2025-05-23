import { body, param, query } from "express-validator";
import { uidHotelExist } from "../helpers/db-validators.js";
import { validationsFields } from "./validatorsFields.js";
import { validateJWT } from "./validate-token.js";
import { hasRoles } from "./validate-role.js";
import { catchErrors } from "./catch-errors.js";

export const registerHotelValidator = [
  validateJWT,
  hasRoles("ADMIN_ROLE"),
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("email").isEmail().withMessage("El correo no es válido"),
  body("phone").notEmpty().withMessage("El teléfono es obligatorio"),
  body("address").notEmpty().withMessage("La dirección es obligatoria"), // <-- corregido
  body("category")
    .isIn(["1 STARS", "2 STARS", "3 STARS", "4 STARS", "5 STARS"])
    .withMessage("La categoría debe ser una de: '1 STARS' a '5 STARS'"),
  body("price").isNumeric().withMessage("El precio debe ser un número"),
  body("description").notEmpty().withMessage("La descripción es obligatoria"),
  body("department").notEmpty().withMessage("El departamento es obligatorio"),
  validationsFields,
  catchErrors,
];

export const getHotelByIdValidator = [
  param("uid").isMongoId().withMessage("No es un ID válido de MongoDB"),
  param("uid").custom(uidHotelExist),
  validationsFields,
  catchErrors,
];

export const deleteHotelValidator = [
  validateJWT,
  hasRoles("ADMIN_ROLE"),
  param("uid").isMongoId().withMessage("No es un ID válido de MongoDB"),
  param("uid").custom(uidHotelExist),
  validationsFields,
  catchErrors,
];

export const updateHotelValidator = [
  validateJWT,
  hasRoles("ADMIN_ROLE"),
  param("uid").isMongoId().withMessage("No es un ID válido de MongoDB"),
  param("uid").custom(uidHotelExist),
  validationsFields,
  catchErrors,
];

export const searchHotelsValidator = [
  query("search")
    .optional()
    .isString()
    .withMessage("El término de búsqueda debe ser texto"),
  query("limite")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El parámetro limite debe ser un entero positivo"),
  query("desde")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El parámetro desde debe ser un entero no negativo"),
  validationsFields,
  catchErrors,
];
