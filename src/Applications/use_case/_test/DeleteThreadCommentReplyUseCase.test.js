/* eslint-disable no-undef */
const DeleteThreadCommentReplyUseCase = require('../DeleteThreadCommentReplyUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/thread_comments/ThreadCommentRepository');
const ThreadCommentReplyRepository = require('../../../Domains/thread_comment_replies/ThreadCommentReplyRepository');

describe('DeleteThreadCommentReplyUseCase', () => {
  it('should orchestrating the delete thread comment reply action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadCommentReplyRepository = new ThreadCommentReplyRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.verifyAvailableThreadComment = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentReplyRepository.verifyAvalilableThreadCommentReply = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentReplyRepository.verifyAvalilableThreadCommentReplyByUser = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentReplyRepository.deleteThreadCommentReply = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteThreadCommentReplyUseCase = new DeleteThreadCommentReplyUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      threadCommentReplyRepository: mockThreadCommentReplyRepository,
    });

    // Action
    await deleteThreadCommentReplyUseCase.execute(userId, threadId, commentId, replyId);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadCommentRepository.verifyAvailableThreadComment).toBeCalledWith(commentId);
    expect(mockThreadCommentReplyRepository.verifyAvalilableThreadCommentReply).toBeCalledWith(replyId);
    expect(mockThreadCommentReplyRepository.verifyAvalilableThreadCommentReplyByUser).toBeCalledWith(userId, replyId);
    expect(mockThreadCommentReplyRepository.deleteThreadCommentReply).toBeCalledWith(replyId);
  });
});
