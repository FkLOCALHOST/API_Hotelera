import {body, param} from 'express-validator';
import {handleErrors} from './handle-error.js';
import {validationsFields} from './validatorsFields.js';
import { deleteFileOnError } from './delete-file-error.js';
import { validateJWT } from './validate-token.js';
import { hasRoles } from './validate-role.js';


export const createEventValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string')
        .isLength({min: 5})
        .withMessage('Name must be at least 5 characters long'),
    body('description')
        .notEmpty()
        .withMessage('Description is required')
        .isString()
        .withMessage('Description must be a string')
        .isLength({min: 10})
        .withMessage('Description must be at least 10 characters long'),
    body('price')
        .notEmpty()
        .withMessage('Price is required')
        .isNumeric()
        .withMessage('Price must be a number'),
    body('date')
        .notEmpty()
        .withMessage('Date is required')
        .isDate()
        .withMessage('Date must be a valid date in YYYY-MM-DD format'),
    body('place')
        .notEmpty()
        .withMessage('Place is required')
        .isString()
        .withMessage('Place must be a string'),
        validationsFields,
        deleteFileOnError,
        handleErrors
]

export const updateEventValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param('eid')
        .notEmpty()
        .withMessage('Event ID is required')
        .isMongoId()
        .withMessage('Event ID must be a valid MongoDB ObjectID'),
    body('name')
        .optional()
        .isString()
        .withMessage('Name must be a string')
        .isLength({min: 5})
        .withMessage('Name must be at least 5 characters long'),
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string')
        .isLength({min: 10})
        .withMessage('Description must be at least 10 characters long'),
    body('price')
        .optional()
        .isNumeric()
        .withMessage('Price must be a number'),
    body('date')
        .optional()
        .isDate()
        .withMessage('Date must be a valid date in YYYY-MM-DD format'),
    body('place')
        .optional()
        .isString()
        .withMessage('Place must be a string'),
    validationsFields,
    handleErrors,
]

export const deleteEventValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param('eid')
        .notEmpty()
        .withMessage('Event ID is required')
        .isMongoId()
        .withMessage('Event ID must be a valid MongoDB ObjectID'),
]

export const searchEventValidator = [
    param('search')
        .notEmpty()
        .withMessage('Search term is required')
        .isString()
        .withMessage('Search term must be a string'),
]






