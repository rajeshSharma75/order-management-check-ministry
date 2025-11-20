const pool = require('../config/database');
const { generateUniqueUID } = require('../utils/uidGenerator');
const { ApiError } = require('../utils/errorHandler');

class OrderModel {
  /**
   * Transform database row to API response format (snake_case to camelCase)
   */
  static transformOrder(row) {
    return {
      id: row.id,
      uid: row.uid,
      orderDescription: row.order_description,
      createdAt: row.created_at,
      productCount: row.product_count,
      products: row.products
    };
  }

  /**
   * Get all orders with their associated products
   */
  static async getAllOrders() {
    const query = `
      SELECT
        o.id,
        o.uid,
        o.order_description,
        o.created_at,
        COUNT(opm.product_uid) as product_count,
        COALESCE(
          json_agg(
            json_build_object(
              'id', p.id,
              'uid', p.uid,
              'productName', p.product_name,
              'productDescription', p.product_description
            )
          ) FILTER (WHERE p.uid IS NOT NULL),
          '[]'
        ) as products
      FROM orders o
      LEFT JOIN order_product_map opm ON o.uid = opm.order_uid
      LEFT JOIN products p ON opm.product_uid = p.uid
      GROUP BY o.id, o.uid, o.order_description, o.created_at
      ORDER BY o.created_at DESC
    `;

    const result = await pool.query(query);
    return result.rows.map(row => this.transformOrder(row));
  }

  /**
   * Get order by UID with associated products
   */
  static async getOrderByUid(uid) {
    const query = `
      SELECT
        o.id,
        o.uid,
        o.order_description,
        o.created_at,
        COALESCE(
          json_agg(
            json_build_object(
              'id', p.id,
              'uid', p.uid,
              'productName', p.product_name,
              'productDescription', p.product_description
            )
          ) FILTER (WHERE p.uid IS NOT NULL),
          '[]'
        ) as products
      FROM orders o
      LEFT JOIN order_product_map opm ON o.uid = opm.order_uid
      LEFT JOIN products p ON opm.product_uid = p.uid
      WHERE o.uid = $1
      GROUP BY o.id, o.uid, o.order_description, o.created_at
    `;

    const result = await pool.query(query, [uid]);

    if (result.rows.length === 0) {
      throw new ApiError(404, `Order with UID ${uid} not found`);
    }

    const row = result.rows[0];
    return {
      id: row.id,
      uid: row.uid,
      orderDescription: row.order_description,
      createdAt: row.created_at,
      products: row.products
    };
  }

  /**
   * Create new order with products
   */
  static async createOrder(orderDescription, productUids) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Generate unique UID for the order
      const uid = await generateUniqueUID(pool, 'orders');

      // Insert order
      const orderQuery = `
        INSERT INTO orders (uid, order_description, created_at)
        VALUES ($1, $2, CURRENT_TIMESTAMP)
        RETURNING id, uid, order_description, created_at
      `;

      const orderResult = await client.query(orderQuery, [uid, orderDescription]);
      const order = orderResult.rows[0];

      // Insert product mappings if products are selected
      if (productUids && productUids.length > 0) {
        // Verify all products exist by their UIDs
        const productsQuery = `
          SELECT uid FROM products WHERE uid = ANY($1)
        `;
        const productsResult = await client.query(productsQuery, [productUids]);

        if (productsResult.rows.length !== productUids.length) {
          throw new ApiError(400, 'One or more product UIDs are invalid');
        }

        // Insert mappings
        const mappingQuery = `
          INSERT INTO order_product_map (order_uid, product_uid)
          VALUES ($1, $2)
        `;

        for (const productRow of productsResult.rows) {
          await client.query(mappingQuery, [order.uid, productRow.uid]);
        }
      }

      await client.query('COMMIT');

      // Fetch the complete order with products
      return await this.getOrderByUid(order.uid);

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Update order
   */
  static async updateOrder(uid, orderDescription, productUids) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Check if order exists
      const checkQuery = 'SELECT uid FROM orders WHERE uid = $1';
      const checkResult = await client.query(checkQuery, [uid]);

      if (checkResult.rows.length === 0) {
        throw new ApiError(404, `Order with UID ${uid} not found`);
      }

      // Update order description
      const updateQuery = `
        UPDATE orders
        SET order_description = $1
        WHERE uid = $2
        RETURNING id, uid, order_description, created_at
      `;

      await client.query(updateQuery, [orderDescription, uid]);

      // Delete existing product mappings
      await client.query('DELETE FROM order_product_map WHERE order_uid = $1', [uid]);

      // Insert new product mappings
      if (productUids && productUids.length > 0) {
        const productsQuery = `SELECT uid FROM products WHERE uid = ANY($1)`;
        const productsResult = await client.query(productsQuery, [productUids]);

        if (productsResult.rows.length !== productUids.length) {
          throw new ApiError(400, 'One or more product UIDs are invalid');
        }

        const mappingQuery = `
          INSERT INTO order_product_map (order_uid, product_uid)
          VALUES ($1, $2)
        `;

        for (const productRow of productsResult.rows) {
          await client.query(mappingQuery, [uid, productRow.uid]);
        }
      }

      await client.query('COMMIT');

      // Fetch updated order with products
      return await this.getOrderByUid(uid);

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Delete order
   */
  static async deleteOrder(uid) {
    const query = 'DELETE FROM orders WHERE uid = $1 RETURNING uid';
    const result = await pool.query(query, [uid]);

    if (result.rows.length === 0) {
      throw new ApiError(404, `Order with UID ${uid} not found`);
    }

    return result.rows[0];
  }
}

module.exports = OrderModel;
