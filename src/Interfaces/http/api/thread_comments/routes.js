const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postThreadCommentHandler,
    options: {
      auth: 'forum_app',
    },
  },
]);

module.exports = routes;
