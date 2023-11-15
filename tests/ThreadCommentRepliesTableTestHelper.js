/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentRepliesTableTestHelper = {
  async addThreadCommentReply({
    id = 'reply-123', content = 'sebuah balasan', threadId = 'thread-123', commentId = 'comment-123', userId = 'user-123', isDelete = false, createdAt = new Date().toISOString(),
  }) {
    const query = {
      text: 'INSERT INTO thread_comment_replies VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [id, content, threadId, commentId, userId, isDelete, createdAt],
    };

    await pool.query(query);
  },

  async findThreadCommentReplyById(id) {
    const query = {
      text: 'SELECT * FROM thread_comment_replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async softDeleteThreadCommentReplyById(id) {
    const query = {
      text: 'UPDATE thread_comment_replies SET is_delete = $1 WHERE id = $2',
      values: [true, id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM thread_comment_replies');
  },
};

module.exports = ThreadCommentRepliesTableTestHelper;
