const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const {
  createOrderValidation,
  updateOrderValidation,
  orderUidValidation,
  validate
} = require('../validators/orderValidator');

// GET /api/order - Get all orders
router.get('/order', orderController.getAllOrders);

// GET /api/order/:uid - Get order by UID
router.get(
  '/order/:uid',
  orderUidValidation,
  validate,
  orderController.getOrderByUid
);

// POST /api/orders - Create new order
router.post(
  '/orders',
  createOrderValidation,
  validate,
  orderController.createOrder
);

// PUT /api/orders/:uid - Update order by UID
router.put(
  '/orders/:uid',
  updateOrderValidation,
  validate,
  orderController.updateOrder
);

// DELETE /api/orders/:uid - Delete order by UID
router.delete(
  '/orders/:uid',
  orderUidValidation,
  validate,
  orderController.deleteOrder
);

module.exports = router;
