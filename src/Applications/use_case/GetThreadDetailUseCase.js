class GetThreadDetailUseCase {
  constructor({
    threadRepository,
    threadCommentRepository,
    threadCommentReplyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
    this._threadCommentReplyRepository = threadCommentReplyRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const threadComments = await this._threadCommentRepository.getThreadCommentsByThreadId(threadId);

    const mapThreadComments = await Promise.all(
      threadComments.map(async (comment) => {
        const threadCommentReplies = await this._threadCommentReplyRepository.getThreadCommentRepliesByCommentId(comment.id);
        // eslint-disable-next-line no-param-reassign
        comment.replies = Array.isArray(threadCommentReplies) && threadCommentReplies.length > 0 ? threadCommentReplies : [];
        return comment;
      }),
    );

    thread.comments = Array.isArray(mapThreadComments) && mapThreadComments.length > 0 ? mapThreadComments : [];
    return thread;
  }
}

module.exports = GetThreadDetailUseCase;
