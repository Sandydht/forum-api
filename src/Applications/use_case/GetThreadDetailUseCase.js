const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');
const ThreadCommentDetail = require('../../Domains/thread_comments/entities/ThreadCommentDetail');
const ThreadCommentReplyDetail = require('../../Domains/thread_comment_replies/entities/ThreadCommentReplyDetail');

class GetThreadDetailUseCase {
  constructor({
    threadRepository,
    threadCommentRepository,
    threadCommentReplyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
    this._threadCommentReplyRepository = threadCommentReplyRepository;
  }

  async execute(threadId) {
    const threadDetail = await this._threadRepository.getThreadById(threadId);
    const threadComments = await this._threadCommentRepository.getThreadCommentsByThreadId(threadId);

    const thread = new ThreadDetail({
      id: threadDetail.id,
      title: threadDetail.title,
      body: threadDetail.body,
      date: threadDetail.created_at,
      username: threadDetail.username,
    });

    const mapThreadComments = await Promise.all(
      threadComments.map(async (comment) => {
        const threadCommentReplies = await this._threadCommentReplyRepository.getThreadCommentRepliesByCommentId(comment.id);
        const mapThreadCommentReplies = threadCommentReplies.map((reply) => new ThreadCommentReplyDetail({
          id: reply.id,
          username: reply.username,
          date: reply.created_at,
          content: reply.content,
          isDelete: reply.is_delete,
        }));

        return {
          ...new ThreadCommentDetail({
            id: comment.id,
            username: comment.username,
            date: comment.created_at,
            content: comment.content,
            isDelete: comment.is_delete,
          }),
          replies: mapThreadCommentReplies,
        };
      }),
    );

    thread.comments = mapThreadComments;
    return thread;
  }
}

module.exports = GetThreadDetailUseCase;
