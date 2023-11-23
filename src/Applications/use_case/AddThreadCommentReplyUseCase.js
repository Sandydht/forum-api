const AddThreadCommentReply = require('../../Domains/thread_comment_replies/entities/AddThreadCommentReply');
const AddedThreadCommentReply = require('../../Domains/thread_comment_replies/entities/AddedThreadCommentReply');

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

  async execute(userId, threadId, commentId, useCasePayload) {
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._threadCommentRepository.verifyAvailableThreadComment(commentId);
    const addThreadCommentReply = new AddThreadCommentReply(useCasePayload);
    const addedThreadCommentReply = await this._threadCommentReplyRepository.addThreadCommentReply(userId, threadId, commentId, addThreadCommentReply);
    return new AddedThreadCommentReply({
      id: addedThreadCommentReply.id,
      content: addedThreadCommentReply.content,
      owner: addedThreadCommentReply.user_id,
    });
  }
}

module.exports = AddThreadCommentReplyUseCase;
