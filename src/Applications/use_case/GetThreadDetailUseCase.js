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
    await this._threadRepository.verifyAvailableThread(threadId);

    const thread = await this._threadRepository.getThreadById(threadId);
    const threadComments = await this._threadCommentRepository.getCommentByThreadId(threadId);
    const mapThreadComments = await Promise.all((threadComments || []).map(async (comment) => ({
      ...comment,
      replies: await this._threadCommentReplyRepository.getRepliesByThread(threadId, comment.id),
    })));

    thread.comments = mapThreadComments;
    return thread;
  }
}

module.exports = GetThreadDetailUseCase;
