class DeleteThreadCommentReplyUseCase {
  constructor({
    threadRepository,
    threadCommentRepository,
    threadCommentReplyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
    this._threadCommentReplyRepository = threadCommentReplyRepository;
  }

  async execute(userId, threadId, commentId, replyId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._threadCommentRepository.verifyAvailableThreadComment(commentId);
    await this._threadCommentReplyRepository.verifyAvalilableThreadCommentReply(replyId);
    await this._threadCommentReplyRepository.verifyAvalilableThreadCommentReplyByUser(userId, replyId);
    await this._threadCommentReplyRepository.deleteThreadCommentReply(replyId);
  }
}

module.exports = DeleteThreadCommentReplyUseCase;
