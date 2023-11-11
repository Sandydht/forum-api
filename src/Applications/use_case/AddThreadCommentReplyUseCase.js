const AddThreadCommentReply = require('../../Domains/thread_comment_replies/entities/AddThreadCommentReply');

class AddThreadCommentReplyUseCase {
  constructor({
    threadRepository,
    threadCommentRepository,
    threadCommentReplyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
    this._threadCommentReplyRepository = threadCommentReplyRepository;
  }

  async execute(userId, threadId, commentId, payload) {
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._threadCommentRepository.verifyAvailableThreadComment(commentId);
    const addThreadCommentReply = new AddThreadCommentReply(payload);
    return this._threadCommentReplyRepository.addThreadCommentReply(userId, threadId, commentId, addThreadCommentReply);
  }
}

module.exports = AddThreadCommentReplyUseCase;
