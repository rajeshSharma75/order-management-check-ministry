/**
 * Generates a unique 13-character alphanumeric UID
 * @returns {string} 13-character alphanumeric string
 */
function generateUID() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let uid = '';

  for (let i = 0; i < 13; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    uid += chars[randomIndex];
  }

  return uid;
}

/**
 * Generates a unique UID and checks if it exists in the database
 * @param {object} pool - PostgreSQL pool instance
 * @param {string} tableName - Name of the table to check
 * @returns {Promise<string>} Unique UID
 */
async function generateUniqueUID(pool, tableName) {
  let uid;
  let isUnique = false;

  while (!isUnique) {
    uid = generateUID();
    // Convert table name to lowercase for PostgreSQL standard naming
    const normalizedTableName = tableName.toLowerCase();
    const result = await pool.query(
      `SELECT uid FROM ${normalizedTableName} WHERE uid = $1`,
      [uid]
    );
    isUnique = result.rows.length === 0;
  }

  return uid;
}

module.exports = {
  generateUID,
  generateUniqueUID
};
