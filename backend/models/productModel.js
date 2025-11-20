const pool = require('../config/database');

class ProductModel {
  /**
   * Get all products
   */
  static async getAllProducts() {
    const query = `
      SELECT
        id,
        uid,
        product_name,
        product_description,
        created_at
      FROM products
      ORDER BY id ASC
    `;

    const result = await pool.query(query);
    // Transform snake_case to camelCase for API response
    return result.rows.map(row => ({
      id: row.id,
      uid: row.uid,
      productName: row.product_name,
      productDescription: row.product_description,
      createdAt: row.created_at
    }));
  }

  /**
   * Get product by ID
   */
  static async getProductById(id) {
    const query = `
      SELECT
        id,
        uid,
        product_name,
        product_description,
        created_at
      FROM products
      WHERE id = $1
    `;

    const result = await pool.query(query, [id]);
    if (!result.rows[0]) return null;

    // Transform snake_case to camelCase for API response
    const row = result.rows[0];
    return {
      id: row.id,
      uid: row.uid,
      productName: row.product_name,
      productDescription: row.product_description,
      createdAt: row.created_at
    };
  }
}

module.exports = ProductModel;
