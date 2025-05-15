import { body , check } from "express-validator";
import { emailExist, userNameExist , uidExist} from "../helpers/db-validators.js";
import { validationsFields } from "./validatorsFields.js";
import {deleteFileOnError} from "./delete-file-error.js"

export const registerValidator = [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("userName").not().isEmpty().withMessage("userName is required"),
    body("email").not().isEmpty().withMessage("Email is required"),
    body("email").isEmail().withMessage("Invalid Email"),
    body("email").custom(emailExist),
    body("userName").custom(userNameExist),
    validationsFields
];

export const loginValidator = [
    body("email").optional().isEmail().withMessage("Invalid email"),
    body("userName").optional().isString().withMessage("Invalid Username"),
    body("password").isLength({min: 7}).withMessage("The password need have 7 characteres"),
    validationsFields
];

export const getUserByIdValidator = [
    check("uid").isMongoId().withMessage("No es un ID válido"),
    check("uid").custom(uidExist),
    validationsFields,
    deleteFileOnError
];

export const deleteUserValidator = [
    check("uid").isMongoId().withMessage("No es un ID válido"),
    check("uid").custom(uidExist),
    validationsFields,
    deleteFileOnError
];

export const updatePasswordValidator = [
    check("uid").isMongoId().withMessage("No es un Id de Mongo Válido"),
    check("uid").custom(uidExist),
    body("newPassword").isLength({min: 8}).withMessage("La contraseñ a debe tener 8 carácteres"),
    validationsFields,
    deleteFileOnError
];

