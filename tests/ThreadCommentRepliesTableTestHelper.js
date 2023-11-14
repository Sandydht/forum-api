/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentRepliesTableTestHelper = {
  async addThreadCommentReply({
    id = 'reply-123', content = 'sebuah balasan', threadId = 'thread-123', commentId = 'comment-123', userId = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO thread_comment_replies VALUES($1, $2, $3, $4, $5)',
      values: [id, content, threadId, commentId, userId],
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
    const date = new Date().getTime() / 1000.0; // epoch

    const query = {
      text: 'UPDATE thread_comment_replies SET deleted_at = $1, updated_at = $2 WHERE id = $3',
      values: [date, date, id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM thread_comment_replies');
  },
};

module.exports = ThreadCommentRepliesTableTestHelper;
