const ThreadCommentReplyRepository = require('../../Domains/thread_comment_replies/ThreadCommentReplyRepository');
const AddThreadCommentReply = require('../../Domains/thread_comment_replies/entities/AddThreadCommentReply');
const AddedThreadCommentReply = require('../../Domains/thread_comment_replies/entities/AddedThreadCommentReply');

class ThreadCommentReplyRepositoryPostgres extends ThreadCommentReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThreadCommentReply(userId, threadId, commentId, payload) {
    const id = `reply-${this._idGenerator()}`;
    const addThreadCommentReplyPayload = new AddThreadCommentReply(payload);

    const query = {
      text: 'INSERT INTO thread_comment_replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, user_id',
      values: [id, addThreadCommentReplyPayload.content, threadId, commentId, userId],
    };

    const result = await this._pool.query(query);
    return new AddedThreadCommentReply({
      id: result.rows[0].id,
      content: result.rows[0].content,
      userId: result.rows[0].user_id,
    });
  }
}

module.exports = ThreadCommentReplyRepositoryPostgres;
