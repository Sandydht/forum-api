/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const UsersTableTestHelper = {
  async addUser({
    id = 'user-123', username = 'sandy', password = 'secret', fullname = 'Sandy Dwi', isDelete = false, createdAt = new Date(),
  }) {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, username, password, fullname, isDelete, createdAt],
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
    const query = {
      text: 'UPDATE users SET is_delete = $1 WHERE id = $3',
      values: [true, id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM users');
  },
};

module.exports = UsersTableTestHelper;
