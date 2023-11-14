const ThreadCommentRepository = require('../../Domains/thread_comments/ThreadCommentRepository');
const AddedThreadComment = require('../../Domains/thread_comments/entities/AddedThreadComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const ThreadCommentDetail = require('../../Domains/thread_comments/entities/ThreadCommentDetail');

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
    const date = Math.floor(new Date().getTime() / 1000.0); // epoch

    const query = {
      text: 'UPDATE thread_comments SET deleted_at = $1, updated_at = $2 WHERE id = $3',
      values: [date, date, id],
    };

    await this._pool.query(query);
  }

  async getThreadCommentsByThreadId(threadId) {
    const query = {
      text: 'SELECT thread_comments.id, thread_comments.created_at, thread_comments.deleted_at, thread_comments.content, users.username FROM thread_comments INNER JOIN users ON thread_comments.user_id = users.id WHERE thread_comments.thread_id = $1 ORDER BY thread_comments.created_at ASC',
      values: [threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return [];
    }

    return result.rows.map((comment) => new ThreadCommentDetail({
      id: comment.id,
      username: comment.username,
      date: comment.created_at,
      content: comment.content,
      isDelete: Boolean(comment.deleted_at),
    }));
  }
}

module.exports = ThreadCommentRepositoryPostgres;
