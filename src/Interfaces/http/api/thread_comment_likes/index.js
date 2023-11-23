const routes = require('./routes');
const ThreadCommentLikesHandler = require('./handler');

module.exports = {
  name: 'thread_comment_likes',
  register: async (server, { container }) => {
    const threadCommentLikesHandler = new ThreadCommentLikesHandler(container);
    server.route((routes(threadCommentLikesHandler)));
  },
};
