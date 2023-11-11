const AddThreadCommentUseCase = require('../../../../Applications/use_case/AddThreadCommentUseCase');
const DeleteThreadCommentUseCase = require('../../../../Applications/use_case/DeleteThreadCommentUseCase');

class ThreadCommentsHandler {
  constructor(container) {
    this._container = container;
    this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
    this.deleteThreadCommentHanlder = this.deleteThreadCommentHanlder.bind(this);
  }

  async postThreadCommentHandler(request, h) {
    const userId = request.auth.credentials.id;
    const { threadId } = request.params;

    const addThreadCommentUseCase = this._container.getInstance(AddThreadCommentUseCase.name);
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

  async deleteThreadCommentHanlder(request) {
    const userId = request.auth.credentials.id;
    const { threadId, commentId } = request.params;

    const deleteThreadCommentUseCase = this._container.getInstance(DeleteThreadCommentUseCase.name);
    await deleteThreadCommentUseCase.execute(userId, threadId, commentId);

    return {
      status: 'success',
    };
  }
}

module.exports = ThreadCommentsHandler;
