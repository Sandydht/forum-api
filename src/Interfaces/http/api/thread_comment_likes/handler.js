const LikeOrUnlikeThreadCommentUseCase = require('../../../../Applications/use_case/LikeOrUnlikeThreadCommentUseCase');

class ThreadCommentLikesHandler {
  constructor(container) {
    this._container = container;
    this.putThreadCommentLikeHandler = this.putThreadCommentLikeHandler.bind(this);
  }

  async putThreadCommentLikeHandler(request) {
    const likeOrUnlikeThreadCommentUseCase = this._container.getInstance(LikeOrUnlikeThreadCommentUseCase.name);

    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    await likeOrUnlikeThreadCommentUseCase.execute(userId, threadId, commentId);

    return {
      status: 'success',
    };
  }
}

module.exports = ThreadCommentLikesHandler;
