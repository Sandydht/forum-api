class GetThreadDetailUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyAvailableThread(threadId);

    const thread = await this._threadRepository.getThreadById(threadId);
    const threadComments = await this._threadCommentRepository.getCommentByThreadId(threadId);

    thread.comments = threadComments;
    return thread;
  }
}

module.exports = GetThreadDetailUseCase;
