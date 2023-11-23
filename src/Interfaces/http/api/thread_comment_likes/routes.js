const routes = (handler) => ([
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: handler.putThreadCommentLikeHandler,
    options: {
      auth: 'forum_app',
    },
  },
]);

module.exports = routes;
