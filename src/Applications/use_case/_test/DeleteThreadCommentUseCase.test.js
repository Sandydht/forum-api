/* eslint-disable no-undef */
const DeleteThreadCommentUseCase = require('../DeleteThreadCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/thread_comments/ThreadCommentRepository');

describe('DeleteThreadCommentUseCase', () => {
  it('should orchestrating the delete thread comment action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.verifyAvailableThreadComment = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.verifyAvailableThreadCommentByUser = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.deleteThreadComment = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    await deleteThreadCommentUseCase.execute(userId, threadId, commentId);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadCommentRepository.verifyAvailableThreadComment).toBeCalledWith(commentId);
    expect(mockThreadCommentRepository.verifyAvailableThreadCommentByUser).toBeCalledWith(userId, commentId);
    expect(mockThreadCommentRepository.deleteThreadComment).toBeCalledWith(commentId);
    expect(deleteThreadCommentUseCase).toBeInstanceOf(DeleteThreadCommentUseCase);
  });
});
