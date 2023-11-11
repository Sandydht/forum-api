const ThreadCommentRepository = require('../../Domains/thread_comments/ThreadCommentRepository');
const AddedThreadComment = require('../../Domains/thread_comments/entities/AddedThreadComment');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

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
    return new AddedThreadComment({
      id: result.rows[0].id,
      content: result.rows[0].content,
      owner: result.rows[0].user_id,
    });
  }

  async verifyThreadCommentByUser(userId, commentId) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE user_id = $1 AND id = $2',
      values: [userId, commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Anda tidak dapat menghapus komentar ini');
    }
  }

  async verifyAvailableThreadComment(id) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Comment tidak ditemukan');
    }
  }

  async deleteThreadComment(id) {
    const updatedAt = Math.floor(new Date().getTime() / 1000.0);
    const deletedAt = Math.floor(new Date().getTime() / 1000.0);

    const query = {
      text: 'UPDATE thread_comments SET deleted_at = $1, updated_at = $2 WHERE id = $3 RETURNING id',
      values: [deletedAt, updatedAt, id],
    };

    await this._pool.query(query);
  }
}

module.exports = ThreadCommentRepositoryPostgres;
