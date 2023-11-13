class DeleteThreadCommentUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(userId, threadId, commentId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._threadCommentRepository.verifyAvailableThreadComment(commentId);
    await this._threadCommentRepository.verifyAvailableThreadCommentByUser(userId, commentId);
    return this._threadCommentRepository.deleteThreadComment(commentId);
  }
}

module.exports = DeleteThreadCommentUseCase;
