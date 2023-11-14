class GetThreadCommentByThreadUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    return this._threadCommentRepository.getThreadCommentsByThreadId(threadId);
  }
}

module.exports = GetThreadCommentByThreadUseCase;
