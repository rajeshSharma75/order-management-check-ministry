/**
 * Success response handler
 */
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data
  });
};

/**
 * Created response handler (for POST requests)
 */
const createdResponse = (res, data, message = 'Resource created successfully') => {
  return successResponse(res, data, message, 201);
};

/**
 * No content response handler (for DELETE requests)
 */
const noContentResponse = (res, message = 'Resource deleted successfully') => {
  return res.status(200).json({
    success: true,
    statusCode: 200,
    message
  });
};

module.exports = {
  successResponse,
  createdResponse,
  noContentResponse
};
