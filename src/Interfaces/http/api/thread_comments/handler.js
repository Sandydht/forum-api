const AddThreadCommentUseCase = require('../../../../Applications/use_case/AddThreadCommentUseCase');
const DeleteThreadCommentUseCase = require('../../../../Applications/use_case/DeleteThreadCommentUseCase');

class ThreadCommentsHandler {
  constructor(container) {
    this._container = container;
    this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
    this.deleteThreadCommentHandler = this.deleteThreadCommentHandler.bind(this);
  }

  async postThreadCommentHandler(request, h) {
    const addThreadCommentUseCase = this._container.getInstance(AddThreadCommentUseCase.name);

    const { id: userId } = request.auth.credentials;
    const { threadId } = request.params;
    const addedComment = await addThreadCommentUseCase.execute(userId, threadId, request.payload);

    const response = h.response({
      status: 'success',
      data: { addedComment },
    });
    response.code(201);
    return response;
  }

  async deleteThreadCommentHandler(request) {
    const deleteThreadCommentUseCase = this._container.getInstance(DeleteThreadCommentUseCase.name);

    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    await deleteThreadCommentUseCase.execute(userId, threadId, commentId);

    return {
      status: 'success',
    };
  }
}

module.exports = ThreadCommentsHandler;
