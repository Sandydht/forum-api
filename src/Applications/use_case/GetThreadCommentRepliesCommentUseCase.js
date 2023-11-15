class GetThreadCommentRepliesByCommentUseCase {
  constructor({ threadCommentRepository, threadCommentReplyRepository }) {
    this._threadCommentRepository = threadCommentRepository;
    this._threadCommentReplyRepository = threadCommentReplyRepository;
  }

  async execute(commentId) {
    await this._threadCommentRepository.verifyAvailableThreadComment(commentId);
    return this._threadCommentReplyRepository.getThreadCommentRepliesByCommentId(commentId);
  }
}

module.exports = GetThreadCommentRepliesByCommentUseCase;
