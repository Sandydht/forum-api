/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123', title = 'sebuah thread', body = 'sebuah body thread', userId = 'user-123', createdAt = new Date().toISOString(),
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, userId, createdAt],
    };

    await pool.query(query);
  },

  async findThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async softDeleteThreadById(id) {
    const date = new Date().toISOString();

    const query = {
      text: 'UPDATE threads SET deleted_at = $1, updated_at = $2 WHERE id = $3',
      values: [date, date, id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads');
  },
};

module.exports = ThreadsTableTestHelper;
