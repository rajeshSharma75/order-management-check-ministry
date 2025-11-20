const { ApiError, asyncHandler } = require('../../backend/utils/errorHandler');

describe('Error Handler Utils', () => {
  describe('ApiError', () => {
    test('should create an ApiError with status code and message', () => {
      const error = new ApiError(404, 'Not found');

      expect(error).toBeInstanceOf(Error);
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Not found');
      expect(error.isOperational).toBe(true);
    });

    test('should have proper stack trace', () => {
      const error = new ApiError(500, 'Internal error');

      expect(error.stack).toBeDefined();
    });
  });

  describe('asyncHandler', () => {
    test('should handle successful async operations', async () => {
      const mockFn = jest.fn().mockResolvedValue('success');
      const wrappedFn = asyncHandler(mockFn);

      const req = {};
      const res = {};
      const next = jest.fn();

      await wrappedFn(req, res, next);

      expect(mockFn).toHaveBeenCalledWith(req, res, next);
      expect(next).not.toHaveBeenCalled();
    });

    test('should catch and pass errors to next', async () => {
      const error = new Error('Test error');
      const mockFn = jest.fn().mockRejectedValue(error);
      const wrappedFn = asyncHandler(mockFn);

      const req = {};
      const res = {};
      const next = jest.fn();

      await wrappedFn(req, res, next);

      expect(mockFn).toHaveBeenCalledWith(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
