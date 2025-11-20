const { body, param, validationResult } = require('express-validator');
const { ApiError } = require('../utils/errorHandler');

/**
 * Validation rules for creating an order
 */
const createOrderValidation = [
  body('orderDescription')
    .trim()
    .notEmpty()
    .withMessage('Order description is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Order description must be between 3 and 100 characters'),

  body('productUids')
    .optional()
    .isArray()
    .withMessage('Product UIDs must be an array')
    .custom((value) => {
      if (value && value.length > 0) {
        const allValidUids = value.every(uid =>
          typeof uid === 'string' &&
          uid.length === 13 &&
          /^[A-Z0-9]+$/.test(uid)
        );
        if (!allValidUids) {
          throw new Error('All product UIDs must be 13-character alphanumeric strings');
        }
      }
      return true;
    })
];

/**
 * Validation rules for updating an order
 */
const updateOrderValidation = [
  param('uid')
    .trim()
    .notEmpty()
    .withMessage('Order UID is required')
    .isLength({ min: 13, max: 13 })
    .withMessage('Order UID must be exactly 13 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Order UID must contain only uppercase letters and numbers'),

  body('orderDescription')
    .trim()
    .notEmpty()
    .withMessage('Order description is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Order description must be between 3 and 100 characters'),

  body('productUids')
    .optional()
    .isArray()
    .withMessage('Product UIDs must be an array')
    .custom((value) => {
      if (value && value.length > 0) {
        const allValidUids = value.every(uid =>
          typeof uid === 'string' &&
          uid.length === 13 &&
          /^[A-Z0-9]+$/.test(uid)
        );
        if (!allValidUids) {
          throw new Error('All product UIDs must be 13-character alphanumeric strings');
        }
      }
      return true;
    })
];

/**
 * Validation rules for order UID parameter
 */
const orderUidValidation = [
  param('uid')
    .trim()
    .notEmpty()
    .withMessage('Order UID is required')
    .isLength({ min: 13, max: 13 })
    .withMessage('Order UID must be exactly 13 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Order UID must contain only uppercase letters and numbers')
];

/**
 * Middleware to handle validation errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    throw new ApiError(400, errorMessages);
  }

  next();
};

module.exports = {
  createOrderValidation,
  updateOrderValidation,
  orderUidValidation,
  validate
};
