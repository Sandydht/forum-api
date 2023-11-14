/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const UsersTableTestHelper = {
  async addUser({
    id = 'user-123', username = 'sandy', password = 'secret', fullname = 'Sandy Dwi', createdAt = new Date().toISOString(),
  }) {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5)',
      values: [id, username, password, fullname, createdAt],
    };

    await pool.query(query);
  },

  async findUsersById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async softDeleteUserById(id) {
    const date = new Date().toISOString();

    const query = {
      text: 'UPDATE users SET deleted_at = $1, updated_at = $2 WHERE id = $3',
      values: [date, date, id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM users');
  },
};

module.exports = UsersTableTestHelper;
