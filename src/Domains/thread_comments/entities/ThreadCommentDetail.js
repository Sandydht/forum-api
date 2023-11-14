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
    if (!id || !username || date === undefined || !content || isDelete === undefined) {
      throw new Error('THREAD_COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'number' || typeof content !== 'string' || typeof isDelete !== 'boolean') {
      throw new Error('THREAD_COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPESIFICATION');
    }
  }
}

module.exports = ThreadCommentDetail;
