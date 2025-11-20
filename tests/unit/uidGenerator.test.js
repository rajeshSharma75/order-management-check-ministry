const { generateUID, generateUniqueUID } = require('../../backend/utils/uidGenerator');

describe('UID Generator', () => {
  describe('generateUID', () => {
    test('should generate a 13-character string', () => {
      const uid = generateUID();
      expect(uid).toHaveLength(13);
    });

    test('should generate alphanumeric characters only', () => {
      const uid = generateUID();
      expect(uid).toMatch(/^[A-Z0-9]+$/);
    });

    test('should generate different UIDs on multiple calls', () => {
      const uid1 = generateUID();
      const uid2 = generateUID();
      const uid3 = generateUID();

      expect(uid1).not.toBe(uid2);
      expect(uid2).not.toBe(uid3);
      expect(uid1).not.toBe(uid3);
    });
  });

  describe('generateUniqueUID', () => {
    test('should generate a unique UID', async () => {
      const mockPool = {
        query: jest.fn().mockResolvedValue({ rows: [] }),
      };

      const uid = await generateUniqueUID(mockPool, 'orders');

      expect(uid).toHaveLength(13);
      expect(mockPool.query).toHaveBeenCalled();
    });

    test('should retry if UID already exists', async () => {
      let callCount = 0;
      const mockPool = {
        query: jest.fn().mockImplementation(() => {
          callCount++;
          if (callCount === 1) {
            return Promise.resolve({ rows: [{ uid: 'EXISTING123456' }] });
          }
          return Promise.resolve({ rows: [] });
        }),
      };

      const uid = await generateUniqueUID(mockPool, 'orders');

      expect(uid).toHaveLength(13);
      expect(mockPool.query).toHaveBeenCalledTimes(2);
    });
  });
});
