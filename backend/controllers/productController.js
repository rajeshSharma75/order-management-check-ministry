const ProductModel = require('../models/productModel');
const { successResponse } = require('../utils/responseHandler');
const { asyncHandler } = require('../utils/errorHandler');

/**
 * Get all products
 * GET /api/products
 */
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await ProductModel.getAllProducts();

  successResponse(res, products, 'Products retrieved successfully');
});

module.exports = {
  getAllProducts
};
