const ThreadCommentRepository = require('../../Domains/thread_comments/ThreadCommentRepository');
const AddedThreadComment = require('../../Domains/thread_comments/entities/AddedThreadComment');

class ThreadCommentRepositoryPostgres extends ThreadCommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThreadComment(userId, threadId, payload) {
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const { content } = payload;

    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, user_id',
      values: [id, content, date, threadId, userId],
    };

    const result = await this._pool.query(query);
    return new AddedThreadComment({
      id: result.rows[0].id,
      content: result.rows[0].content,
      owner: result.rows[0].user_id,
    });
  }
}

module.exports = ThreadCommentRepositoryPostgres;
