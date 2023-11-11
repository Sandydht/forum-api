class GetThreadDetailUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyAvailableThread(threadId);

    const thread = await this._threadRepository.getThreadById(threadId);
    console.log('thread: ', thread);
    const threadComments = await this._threadCommentRepository.getCommentByThreadId(threadId);
    console.log('threadComments: ', threadComments);

    thread.comments.push(threadComments);
    return { thread };
  }
}

module.exports = GetThreadDetailUseCase;
