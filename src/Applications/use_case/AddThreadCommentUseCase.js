const AddThreadComment = require('../../Domains/thread_comments/entities/AddThreadComment');

class AddThreadCommentUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(userId, threadId, useCasePayload) {
    await this._threadRepository.verifyAvailableThread(threadId);
    const addThreadComment = new AddThreadComment(useCasePayload);
    return this._threadCommentRepository.addThreadComment(userId, threadId, addThreadComment);
  }
}

module.exports = AddThreadCommentUseCase;
