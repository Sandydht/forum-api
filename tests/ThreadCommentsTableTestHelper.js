/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentsTableTestHelper = {
  async addThreadComment({
    id = 'comment-123', content = 'sebuah comment', threadId = 'thread-123', userId = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4)',
      values: [id, content, threadId, userId],
    };

    await pool.query(query);
  },

  async findThreadCommentById(id) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async softDeleteThreadCommentById(id) {
    const date = new Date().toISOString();

    const query = {
      text: 'UPDATE thread_comments SET deleted_at = $1, updated_at = $2 WHERE id = $3',
      values: [date, date, id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM thread_comments');
  },
};

module.exports = ThreadCommentsTableTestHelper;
