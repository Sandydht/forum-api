class ThreadCommentDetail {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, date, content, isDelete,
    } = payload;
    this.id = id;
    this.username = username;
    this.date = new Date(date).toISOString();
    this.content = isDelete ? '**komentar telah dihapus**' : content;
  }

  _verifyPayload({
    id, username, date, content, isDelete,
  }) {
    if (!id || !username || !date || !content || isDelete === undefined) {
      throw new Error('THREAD_COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || !this._verifyDate(date) || typeof content !== 'string' || typeof isDelete !== 'boolean') {
      throw new Error('THREAD_COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPESIFICATION');
    }
  }

  _verifyDate(date) {
    return date instanceof Date;
  }
}

module.exports = ThreadCommentDetail;
