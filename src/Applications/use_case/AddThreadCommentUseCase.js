const AddThreadComment = require('../../Domains/thread_comments/entities/AddThreadComment');
const AddedThreadComment = require('../../Domains/thread_comments/entities/AddedThreadComment');

class AddThreadCommentUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(userId, threadId, useCasePayload) {
    await this._threadRepository.verifyAvailableThread(threadId);
    const addThreadComment = new AddThreadComment(useCasePayload);
    const addedThreadComment = await this._threadCommentRepository.addThreadComment(userId, threadId, addThreadComment);
    return new AddedThreadComment({
      id: addedThreadComment.id,
      content: addedThreadComment.content,
      owner: addedThreadComment.user_id,
    });
  }
}

module.exports = AddThreadCommentUseCase;
