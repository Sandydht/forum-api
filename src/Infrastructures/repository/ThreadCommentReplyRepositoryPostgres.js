const ThreadCommentReplyRepository = require('../../Domains/thread_comment_replies/ThreadCommentReplyRepository');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadCommentReplyRepositoryPostgres extends ThreadCommentReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThreadCommentReply(userId, threadId, commentId, payload) {
    const id = `reply-${this._idGenerator()}`;
    const { content } = payload;

    const query = {
      text: 'INSERT INTO thread_comment_replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, user_id',
      values: [id, content, threadId, commentId, userId],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async verifyAvailableThreadCommentReplyByUser(userId, id) {
    const query = {
      text: 'SELECT id FROM thread_comment_replies WHERE user_id = $1 AND id = $2',
      values: [userId, id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('Thread comment reply tidak ditemukan');
    }
  }

  async verifyAvailableThreadCommentReply(id) {
    const query = {
      text: 'SELECT id FROM thread_comment_replies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Thread comment reply tidak ditemukan');
    }
  }

  async deleteThreadCommentReply(id) {
    const query = {
      text: 'UPDATE thread_comment_replies SET is_delete = $1 WHERE id = $2',
      values: [true, id],
    };

    await this._pool.query(query);
  }

  async getThreadCommentRepliesByCommentId(commentId) {
    const query = {
      // eslint-disable-next-line max-len
      text: 'SELECT thread_comment_replies.id, thread_comment_replies.created_at, thread_comment_replies.is_delete, thread_comment_replies.content, users.username FROM thread_comment_replies INNER JOIN users ON thread_comment_replies.user_id = users.id WHERE thread_comment_replies.comment_id = $1 ORDER BY thread_comment_replies.created_at ASC',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = ThreadCommentReplyRepositoryPostgres;
