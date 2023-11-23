class LikeOrUnlikeThreadCommentUseCase {
  constructor({
    threadRepository,
    threadCommentRepository,
    threadCommentLikeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
    this._threadCommentLikeRepository = threadCommentLikeRepository;
  }

  async execute(userId, threadId, commentId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._threadCommentRepository.verifyAvailableThreadComment(commentId);
    const threadCommentLikeId = await this._threadCommentLikeRepository.getIdAvailableThreadCommentLike(userId, threadId, commentId);

    if (threadCommentLikeId) {
      await this._threadCommentLikeRepository.deleteThreadCommentLike(threadCommentLikeId);
      return 'Unliked';
    }

    await this._threadCommentLikeRepository.addThreadCommentLike(userId, threadId, commentId);
    return 'Liked';
  }
}

module.exports = LikeOrUnlikeThreadCommentUseCase;
