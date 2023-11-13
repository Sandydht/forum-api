const AddThreadCommentReplyUseCase = require('../../../../Applications/use_case/AddThreadCommentReplyUseCase');

class ThreadCommentRepliesHandler {
  constructor(container) {
    this._container = container;
    this.postThreadCommentReplyHandler = this.postThreadCommentReplyHandler.bind(this);
  }

  async postThreadCommentReplyHandler(request, h) {
    const addThreadCommentReplyUseCase = this._container.getInstance(AddThreadCommentReplyUseCase.name);

    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const addedReply = await addThreadCommentReplyUseCase.execute(userId, threadId, commentId, request.payload);

    const response = h.response({
      status: 'success',
      data: { addedReply },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadCommentRepliesHandler;
