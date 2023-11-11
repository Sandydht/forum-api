const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: handler.postThreadCommentReplyHandler,
    options: {
      auth: 'forum_app',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    handler: handler.deleteThreadCommentReplyHandler,
    options: {
      auth: 'forum_app',
    },
  },
]);

module.exports = routes;
