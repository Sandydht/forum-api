/* eslint-disable no-unused-vars */
class ThreadCommentReplyRepository {
  async addThreadCommentReply(userId, threadId, commentId, payload) {
    throw new Error('THREAD_COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyAvailableThreadCommentReplyByUser(userId, id) {
    throw new Error('THREAD_COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyAvailableThreadCommentReply(id) {
    throw new Error('THREAD_COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteThreadCommentReply(id) {
    throw new Error('THREAD_COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getThreadCommentRepliesByCommentId(id) {
    throw new Error('THREAD_COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ThreadCommentReplyRepository;
