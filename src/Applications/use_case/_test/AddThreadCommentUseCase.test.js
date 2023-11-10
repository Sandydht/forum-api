/* eslint-disable no-undef */
const AddThreadCommentUseCase = require('../AddThreadCommentUseCase');
const AddThreadComment = require('../../../Domains/thread_comments/entities/AddThreadComment');
const AddedThreadComment = require('../../../Domains/thread_comments/entities/AddedThreadComment');
const ThreadCommentRepository = require('../../../Domains/thread_comments/ThreadCommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddThreadCommentUseCase', () => {
  it('should orchestrating the add thread comment action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const useCasePayload = {
      content: 'sebuah comment',
    };

    // Mock
    const mockAddThreadComment = new AddThreadComment(useCasePayload);
    const mockAddedThreadComment = new AddedThreadComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: userId,
    });
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.addThreadComment = jest.fn().mockImplementation(() => Promise.resolve(mockAddedThreadComment));

    const addThreadCommentUseCase = new AddThreadCommentUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    const addedThreadComment = await addThreadCommentUseCase.execute(userId, threadId, mockAddThreadComment);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadCommentRepository.addThreadComment).toBeCalledWith(userId, threadId, useCasePayload);
    expect(addedThreadComment).toStrictEqual(new AddedThreadComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: userId,
    }));
  });
});
