const ThreadCommentReplyRepository = require('../../Domains/thread_comment_replies/ThreadCommentReplyRepository');
const AddedThreadCommentReply = require('../../Domains/thread_comment_replies/entities/AddedThreadCommentReply');
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
    return new AddedThreadCommentReply({
      id: result.rows[0].id,
      content: result.rows[0].content,
      owner: result.rows[0].user_id,
    });
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
    const date = Math.floor(new Date().getTime() / 1000.0); // epoch

    const query = {
      text: 'UPDATE thread_comment_replies SET deleted_at = $1, updated_at = $2 WHERE id = $3',
      values: [date, date, id],
    };

    await this._pool.query(query);
  }
}

module.exports = ThreadCommentReplyRepositoryPostgres;
