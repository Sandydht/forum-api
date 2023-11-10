class DeleteThreadCommentUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(userId, threadId, commentId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._threadCommentRepository.verifyAvailableThreadComment(commentId);

    console.log('userId: ', userId);
    console.log('threadId: ', threadId);
    console.log('commentId: ', commentId);
  }
}

module.exports = DeleteThreadCommentUseCase;
