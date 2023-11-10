const AddThreadCommentUseCase = require('../../../../Applications/use_case/AddThreadCommentUseCase');

class ThreadCommentsHandler {
  constructor(container) {
    this._container = container;
    this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
  }

  async postThreadCommentHandler(request, h) {
    const addThreadCommentUseCase = this._container.getInstance(AddThreadCommentUseCase.name);

    const userId = request.auth.credentials.id;
    const { threadId } = request.params;

    const addedComment = await addThreadCommentUseCase.execute(userId, threadId, request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadCommentsHandler;
