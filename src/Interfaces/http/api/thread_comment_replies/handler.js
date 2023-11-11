const AddThreadCommentReplyUseCase = require('../../../../Applications/use_case/AddThreadCommentReplyUseCase');
const DeleteThreadCommentReplyUseCase = require('../../../../Applications/use_case/DeleteThreadCommentReplyUseCase');

class ThreadCommentRepliesHandler {
  constructor(container) {
    this._container = container;
    this.postThreadCommentReplyHandler = this.postThreadCommentReplyHandler.bind(this);
    this.deleteThreadCommentReplyHandler = this.deleteThreadCommentReplyHandler.bind(this);
  }

  async postThreadCommentReplyHandler(request, h) {
    const userId = request.auth.credentials.id;
    const { threadId, commentId } = request.params;

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

  async deleteThreadCommentReplyHandler(request) {
    const userId = request.auth.credentials.id;
    const { threadId, commentId, replyId } = request.params;

    const deleteThreadCommentReplyUseCase = await this._container.getInstance(DeleteThreadCommentReplyUseCase.name);
    await deleteThreadCommentReplyUseCase.execute(userId, threadId, commentId, replyId);

    return {
      status: 'success',
    };
  }
}

module.exports = ThreadCommentRepliesHandler;
