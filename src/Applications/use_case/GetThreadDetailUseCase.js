/* eslint-disable no-param-reassign */
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
        comment.replies = threadCommentReplies;

        return comment;
      }),
    );

    thread.comments = mapThreadComments;

    return thread;
  }
}

module.exports = GetThreadDetailUseCase;
