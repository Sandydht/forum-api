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
    mockThreadCommentReplyRepository.verifyAvailableThreadCommentReply = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentReplyRepository.verifyAvailableThreadCommentReplyByUser = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentReplyRepository.deleteThreadCommentReply = jest.fn().mockImplementation(() => Promise.resolve());

    const deletThreadCommentReplyUseCase = new DeleteThreadCommentReplyUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      threadCommentReplyRepository: mockThreadCommentReplyRepository,
    });

    // Action
    await deletThreadCommentReplyUseCase.execute(userId, threadId, commentId, replyId);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadCommentRepository.verifyAvailableThreadComment).toBeCalledWith(commentId);
    expect(mockThreadCommentReplyRepository.verifyAvailableThreadCommentReply).toBeCalledWith(replyId);
    expect(mockThreadCommentReplyRepository.verifyAvailableThreadCommentReplyByUser).toBeCalledWith(userId, replyId);
    expect(mockThreadCommentReplyRepository.deleteThreadCommentReply).toBeCalledWith(replyId);
    expect(deletThreadCommentReplyUseCase).toBeInstanceOf(DeleteThreadCommentReplyUseCase);
  });
});
