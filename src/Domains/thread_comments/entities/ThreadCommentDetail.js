class ThreadCommentDetail {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, date, content,
    } = payload;
    this.id = id;
    this.username = username;
    this.date = new Date(date).toISOString();
    this.content = content;
  }

  _verifyPayload({
    id, username, date, content,
  }) {
    if (!id || !username || !date || !content) {
      throw new Error('THREAD_COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || !Number.isInteger(date) || typeof content !== 'string') {
      throw new Error('THREAD_COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPESIFICATION');
    }
  }
}

module.exports = ThreadCommentDetail;
