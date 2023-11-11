const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postThreadCommentHandler,
    options: {
      auth: 'forum_app',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteThreadCommentHanlder,
    options: {
      auth: 'forum_app',
    },
  },
]);

module.exports = routes;
