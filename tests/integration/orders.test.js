const request = require('supertest');
const app = require('../../backend/server');
const pool = require('../../backend/config/database');

describe('Order API Integration Tests', () => {
  let testOrderUid;

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /api/orders', () => {
    test('should create a new order with products', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          orderDescription: 'Test Order for Customer',
          productIds: [1, 2],
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('uid');
      expect(response.body.data.orderDescription).toBe('Test Order for Customer');

      testOrderUid = response.body.data.uid;
    });

    test('should create order without products', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          orderDescription: 'Order without products',
          productIds: [],
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.orderDescription).toBe('Order without products');
    });

    test('should fail with invalid order description', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          orderDescription: 'ab',
          productIds: [1],
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('should fail with missing order description', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          productIds: [1],
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/order', () => {
    test('should get all orders', async () => {
      const response = await request(app)
        .get('/api/order')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/order/:uid', () => {
    test('should get order by uid', async () => {
      // First create an order to get a valid UID
      if (!testOrderUid) {
        const createResponse = await request(app)
          .post('/api/orders')
          .send({
            orderDescription: 'Test Order for UID Lookup',
            productIds: [1],
          });
        testOrderUid = createResponse.body.data.uid;
      }

      const response = await request(app)
        .get(`/api/order/${testOrderUid}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('uid');
      expect(response.body.data).toHaveProperty('orderDescription');
      expect(response.body.data).toHaveProperty('products');
    });

    test('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .get('/api/order/NONEXIST12345')
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    test('should return 400 for invalid order uid format', async () => {
      const response = await request(app)
        .get('/api/order/invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/orders/:uid', () => {
    test('should update an order', async () => {
      // Create a new order for updating
      if (!testOrderUid) {
        const createResponse = await request(app)
          .post('/api/orders')
          .send({
            orderDescription: 'Order to Update',
            productIds: [1, 2],
          });
        testOrderUid = createResponse.body.data.uid;
      }

      const response = await request(app)
        .put(`/api/orders/${testOrderUid}`)
        .send({
          orderDescription: 'Updated Order Description',
          productIds: [3, 4],
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.orderDescription).toBe('Updated Order Description');
    });

    test('should fail with invalid order description', async () => {
      if (!testOrderUid) {
        const createResponse = await request(app)
          .post('/api/orders')
          .send({
            orderDescription: 'Another Test Order',
            productIds: [1],
          });
        testOrderUid = createResponse.body.data.uid;
      }

      const response = await request(app)
        .put(`/api/orders/${testOrderUid}`)
        .send({
          orderDescription: 'ab',
          productIds: [1],
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/orders/:uid', () => {
    test('should delete an order', async () => {
      // Create a new order specifically for deletion
      const createResponse = await request(app)
        .post('/api/orders')
        .send({
          orderDescription: 'Order to Delete',
          productIds: [1],
        });
      const orderUidToDelete = createResponse.body.data.uid;

      const response = await request(app)
        .delete(`/api/orders/${orderUidToDelete}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test('should return 404 when deleting non-existent order', async () => {
      const response = await request(app)
        .delete('/api/orders/NONEXIST99999')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});
