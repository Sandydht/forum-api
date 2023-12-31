const ThreadCommentRepository = require('../../Domains/thread_comments/ThreadCommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ThreadCommentRepositoryPostgres extends ThreadCommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThreadComment(userId, threadId, payload) {
    const id = `comment-${this._idGenerator()}`;
    const { content } = payload;

    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4) RETURNING id, content, user_id',
      values: [id, content, threadId, userId],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async verifyAvailableThreadComment(id) {
    const query = {
      text: 'SELECT id FROM thread_comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Thread comment tidak ditemukan');
    }
  }

  async verifyAvailableThreadCommentByUser(userId, id) {
    const query = {
      text: 'SELECT id FROM thread_comments WHERE user_id = $1 AND id = $2',
      values: [userId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Thread comment tidak ditemukan');
    }
  }

  async deleteThreadComment(id) {
    const query = {
      text: 'UPDATE thread_comments SET is_delete = $1 WHERE id = $2',
      values: [true, id],
    };

    await this._pool.query(query);
  }

  async getThreadCommentsByThreadId(threadId) {
    const query = {
      // eslint-disable-next-line max-len
      text: 'SELECT thread_comments.id, thread_comments.created_at, thread_comments.is_delete, thread_comments.content, users.username FROM thread_comments INNER JOIN users ON thread_comments.user_id = users.id WHERE thread_comments.thread_id = $1 ORDER BY thread_comments.created_at ASC',
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = ThreadCommentRepositoryPostgres;
