/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentLikesTableTestHelper = {
  async addThreadCommentLike({
    id = 'comment-like-123', threadId = 'thread-123', commentId = 'comment-123', userId = 'user-123', createdAt = new Date().toISOString(),
  }) {
    const query = {
      text: 'INSERT INTO thread_comment_likes VALUES($1, $2, $3, $4, $5)',
      values: [id, threadId, commentId, userId, createdAt],
    };

    await pool.query(query);
  },

  async findThreadCommentLikeById(id) {
    const query = {
      text: 'SELECT * FROM thread_comment_likes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async deleteThreadCommentLike(id) {
    const query = {
      text: 'DELETE thread_comment_likes WHERE id = $1',
      values: [id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM thread_comment_likes');
  },
};

module.exports = ThreadCommentLikesTableTestHelper;
