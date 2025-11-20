const OrderModel = require('../models/orderModel');
const { successResponse, createdResponse, noContentResponse } = require('../utils/responseHandler');
const { asyncHandler } = require('../utils/errorHandler');

/**
 * Get all orders
 * GET /api/order
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await OrderModel.getAllOrders();

  successResponse(res, orders, 'Orders retrieved successfully');
});

/**
 * Get order by UID
 * GET /api/order/:uid
 */
const getOrderByUid = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const order = await OrderModel.getOrderByUid(uid);

  successResponse(res, order, 'Order retrieved successfully');
});

/**
 * Create new order
 * POST /api/orders
 */
const createOrder = asyncHandler(async (req, res) => {
  const { orderDescription, productUids } = req.body;

  const order = await OrderModel.createOrder(orderDescription, productUids);

  createdResponse(res, order, 'Order created successfully');
});

/**
 * Update order by UID
 * PUT /api/orders/:uid
 */
const updateOrder = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const { orderDescription, productUids } = req.body;

  const order = await OrderModel.updateOrder(uid, orderDescription, productUids);

  successResponse(res, order, 'Order updated successfully');
});

/**
 * Delete order by UID
 * DELETE /api/orders/:uid
 */
const deleteOrder = asyncHandler(async (req, res) => {
  const { uid } = req.params;

  await OrderModel.deleteOrder(uid);

  noContentResponse(res, 'Order deleted successfully');
});

module.exports = {
  getAllOrders,
  getOrderByUid,
  createOrder,
  updateOrder,
  deleteOrder
};
