class ThreadCommentDetail {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, date, content, isDelete, replies,
    } = payload;
    this.id = id;
    this.username = username;
    this.date = new Date(date).toISOString();
    this.replies = replies;
    this.content = isDelete ? '**komentar telah dihapus**' : content;
  }

  _verifyPayload({
    id, username, date, content, isDelete, replies,
  }) {
    if (!id || !username || !date || !content || isDelete === undefined || !replies) {
      throw new Error('THREAD_COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || !this._verifyDate(date) || typeof content !== 'string' || typeof isDelete !== 'boolean' || !Array.isArray(replies)) {
      throw new Error('THREAD_COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPESIFICATION');
    }
  }

  _verifyDate(date) {
    return date instanceof Date;
  }
}

module.exports = ThreadCommentDetail;
