/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentsTableTestHelper = {
  async addThreadComment({
    id = 'comment-123', content = 'sebuah comment', threadId = 'thread-123', userId = 'user-123', isDelete = false, createdAt = new Date().toISOString(),
  }) {
    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, threadId, userId, isDelete, createdAt],
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
    const query = {
      text: 'UPDATE thread_comments SET is_delete = $1 WHERE id = $2',
      values: [true, id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM thread_comments');
  },
};

module.exports = ThreadCommentsTableTestHelper;
