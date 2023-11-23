/* eslint-disable no-unused-vars */
class ThreadCommentLikeRepository {
  async addThreadCommentLike(userId, threadId, commentId) {
    throw new Error('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteThreadCommentLike(id) {
    throw new Error('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getIdAvailableThreadCommentLike(userId, threadId, commentId) {
    throw new Error('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getThreadCommentLikeCountByCommentId(commentId) {
    throw new Error('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ThreadCommentLikeRepository;
