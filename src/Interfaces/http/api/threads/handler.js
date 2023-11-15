const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');
const GetThreadCommentByThreadUseCase = require('../../../../Applications/use_case/GetThreadCommentByThreadUseCase');
const GetThreadCommentRepliesByCommentUseCase = require('../../../../Applications/use_case/GetThreadCommentRepliesCommentUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id: userId } = request.auth.credentials;
    const addedThread = await addThreadUseCase.execute(userId, request.payload);

    const response = h.response({
      status: 'success',
      data: { addedThread },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request) {
    const { threadId } = request.params;

    const getThreadDetailUseCase = this._container.getInstance(GetThreadDetailUseCase.name);
    const getThreadCommentByThreadUseCase = this._container.getInstance(GetThreadCommentByThreadUseCase.name);
    const getThreadCommentRepliesByCommentUseCase = this._container.getInstance(GetThreadCommentRepliesByCommentUseCase.name);

    const [threadDetail, comments] = await Promise.all([
      getThreadDetailUseCase.execute(threadId),
      getThreadCommentByThreadUseCase.execute(threadId),
    ]);

    const mapComments = await Promise.all(comments.map(async (comment) => {
      const replies = await getThreadCommentRepliesByCommentUseCase.execute(comment.id);
      return {
        ...comment,
        replies,
      };
    }));

    const thread = {
      ...threadDetail,
      comments: mapComments,
    };

    return {
      status: 'success',
      data: { thread },
    };
  }
}

module.exports = ThreadsHandler;
