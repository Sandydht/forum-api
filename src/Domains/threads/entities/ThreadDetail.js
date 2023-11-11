class ThreadDetail {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, title, body, createdAt, username, comments,
    } = payload;
    this.id = id;
    this.title = title;
    this.body = body;
    this.date = new Date(createdAt).toISOString();
    this.username = username;
    this.comments = comments;
  }

  _verifyPayload({
    id, title, body, createdAt, username, comments,
  }) {
    if (!id || !title || !body || !createdAt || !username || !comments) {
      throw new Error('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof username !== 'string' || typeof createdAt !== 'number' || !Array.isArray(comments)) {
      throw new Error('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPESIFICATION');
    }
  }
}

module.exports = ThreadDetail;
