const pool = require('../config/database');
const { generateUID } = require('../utils/uidGenerator');

async function seedDatabase() {
  const client = await pool.connect();

  try {
    console.log('🔄 Seeding database...');

    await client.query('BEGIN');

    // Check if products already exist
    const checkProducts = await client.query('SELECT COUNT(*) FROM products');

    if (parseInt(checkProducts.rows[0].count) > 0) {
      console.log('⚠️  Database already seeded. Skipping...');
      await client.query('ROLLBACK');
      return;
    }

    // Seed products with UIDs
    const products = [
      { id: 1, name: 'HP laptop', description: 'This is HP laptop' },
      { id: 2, name: 'lenovo laptop', description: 'This is lenovo' },
      { id: 3, name: 'Car', description: 'This is Car' },
      { id: 4, name: 'Bike', description: 'This is Bike' }
    ];

    for (const product of products) {
      const uid = generateUID();
      await client.query(
        'INSERT INTO products (id, uid, product_name, product_description) VALUES ($1, $2, $3, $4)',
        [product.id, uid, product.name, product.description]
      );
      console.log(`✅ Inserted product: ${product.name} (UID: ${uid})`);
    }

    await client.query('COMMIT');
    console.log('✅ Database seeded successfully');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seedDatabase;
