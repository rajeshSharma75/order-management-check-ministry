const request = require('supertest');
const app = require('../../backend/server');
const pool = require('../../backend/config/database');

describe('Product API Integration Tests', () => {
  afterAll(async () => {
    await pool.end();
  });

  describe('GET /api/products', () => {
    test('should get all products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(4);
    });

    test('should return products with correct structure', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      const product = response.body.data[0];
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('uid');
      expect(product).toHaveProperty('productName');
      expect(product).toHaveProperty('productDescription');
    });

    test('should include seeded products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      const productNames = response.body.data.map(p => p.productName);
      expect(productNames).toContain('HP laptop');
      expect(productNames).toContain('lenovo laptop');
      expect(productNames).toContain('Car');
      expect(productNames).toContain('Bike');
    });
  });
});
