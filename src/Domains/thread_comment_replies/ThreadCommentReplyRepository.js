/* eslint-disable no-unused-vars */
class ThreadCommentReplyRepository {
  async addThreadCommentReply(userId, threadId, commentId, payload) {
    throw new Error('THREAD_COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getRepliesByThread(threadId, commentId) {
    throw new Error('THREAD_COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ThreadCommentReplyRepository;
