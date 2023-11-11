const AddThreadCommentReplyUseCase = require('../../../../Applications/use_case/AddThreadCommentReplyUseCase');

class ThreadCommentRepliesHandler {
  constructor(container) {
    this._container = container;
    this.postThreadCommentReplyHandler = this.postThreadCommentReplyHandler.bind(this);
  }

  async postThreadCommentReplyHandler(request, h) {
    const userId = request.auth.credentials.id;
    const { threadId, commentId } = request.params;
    // console.log('userId: ', userId);
    // console.log('threadId: ', threadId);
    // console.log('commentId: ', commentId);
    // console.log('payload: ', request.payload);

    const addedThreadCommentReplyUseCase = await this._container.getInstance(AddThreadCommentReplyUseCase.name);
    const addedReply = await addedThreadCommentReplyUseCase.execute(userId, threadId, commentId, request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadCommentRepliesHandler;
