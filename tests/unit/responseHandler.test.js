const {
  successResponse,
  createdResponse,
  noContentResponse,
} = require('../../backend/utils/responseHandler');

describe('Response Handler Utils', () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('successResponse', () => {
    test('should send success response with default status 200', () => {
      const data = { id: 1, name: 'Test' };
      successResponse(mockRes, data);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        statusCode: 200,
        message: 'Success',
        data,
      });
    });

    test('should send success response with custom message', () => {
      const data = { id: 1 };
      successResponse(mockRes, data, 'Custom message');

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        statusCode: 200,
        message: 'Custom message',
        data,
      });
    });
  });

  describe('createdResponse', () => {
    test('should send created response with status 201', () => {
      const data = { id: 1, name: 'New Item' };
      createdResponse(mockRes, data);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        statusCode: 201,
        message: 'Resource created successfully',
        data,
      });
    });
  });

  describe('noContentResponse', () => {
    test('should send no content response with status 200', () => {
      noContentResponse(mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        statusCode: 200,
        message: 'Resource deleted successfully',
      });
    });
  });
});
