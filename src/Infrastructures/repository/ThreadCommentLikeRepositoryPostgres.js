const ThreadCommentLikeRepository = require('../../Domains/thread_comment_likes/ThreadCommentLikeRepository');

class ThreadCommentLikeRepositoryPostgres extends ThreadCommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThreadCommentLike(userId, threadId, commentId) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO thread_comment_likes VALUES($1, $2, $3, $4) RETURNING id, thread_id, comment_id, user_id',
      values: [id, threadId, commentId, userId],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getIdAvailableThreadCommentLike(userId, threadId, commentId) {
    const query = {
      text: 'SELECT id FROM thread_comment_likes WHERE user_id = $1 AND thread_id = $2 AND comment_id = $3',
      values: [userId, threadId, commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return null;
    }

    return result.rows[0].id;
  }

  async deleteThreadCommentLike(id) {
    const query = {
      text: 'DELETE FROM thread_comment_likes WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }
}

module.exports = ThreadCommentLikeRepositoryPostgres;
