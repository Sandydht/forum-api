class ThreadCommentDetail {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, createdAt, deletedAt, content, replies,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = createdAt !== null ? new Date(createdAt).toISOString() : null;
    this.replies = replies;
    this.content = deletedAt !== null ? '**komentar telah dihapus**' : content;
  }

  _verifyPayload({
    id, username, createdAt, deletedAt, content, replies,
  }) {
    if (!id || !username || createdAt === undefined || deletedAt === undefined || !content || !replies) {
      throw new Error('THREAD_COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || (createdAt !== null && typeof createdAt !== 'number') || (deletedAt !== null && typeof deletedAt !== 'number') || typeof content !== 'string' || !Array.isArray(replies)) {
      throw new Error('THREAD_COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPESIFICATION');
    }
  }
}

module.exports = ThreadCommentDetail;
