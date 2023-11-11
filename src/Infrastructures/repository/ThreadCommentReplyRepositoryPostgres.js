const ThreadCommentReplyRepository = require('../../Domains/thread_comment_replies/ThreadCommentReplyRepository');
const AddThreadCommentReply = require('../../Domains/thread_comment_replies/entities/AddThreadCommentReply');
const AddedThreadCommentReply = require('../../Domains/thread_comment_replies/entities/AddedThreadCommentReply');
const ThreadCommentReplyDetail = require('../../Domains/thread_comment_replies/entities/ThreadCommentReplyDetail');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

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

  async getRepliesByThread(threadId, commentId) {
    const query = {
      // eslint-disable-next-line max-len
      text: 'SELECT thread_comment_replies.id, thread_comment_replies.created_at, thread_comment_replies.deleted_at, thread_comment_replies.content, users.username FROM thread_comment_replies INNER JOIN users ON thread_comment_replies.user_id = users.id WHERE thread_comment_replies.thread_id = $1 AND thread_comment_replies.comment_id = $2',
      values: [threadId, commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return [];
    }

    return result.rows.map((data) => new ThreadCommentReplyDetail({
      id: data.id,
      username: data.username,
      createdAt: data.created_at,
      deletedAt: data.deleted_at,
      content: data.content,
    }));
  }

  async verifyAvalilableThreadCommentReply(id) {
    const query = {
      text: 'SELECT * FROM thread_comment_replies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Reply tidak ditemukan');
    }
  }

  async verifyAvalilableThreadCommentReplyByUser(userId, id) {
    const query = {
      text: 'SELECT * FROM thread_comment_replies WHERE user_id = $1 AND id = $2',
      values: [userId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Anda tidak dapat menghapus balasan komentar ini');
    }
  }

  async deleteThreadCommentReply(id) {
    const updatedAt = Math.floor(new Date().getTime() / 1000.0);
    const deletedAt = Math.floor(new Date().getTime() / 1000.0);

    const query = {
      text: 'UPDATE thread_comment_replies SET deleted_at = $1, updated_at = $2 WHERE id = $3 RETURNING id',
      values: [deletedAt, updatedAt, id],
    };

    await this._pool.query(query);
  }
}

module.exports = ThreadCommentReplyRepositoryPostgres;
