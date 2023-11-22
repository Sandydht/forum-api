/* eslint-disable no-undef */
const AddThreadCommentUseCase = require('../AddThreadCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/thread_comments/ThreadCommentRepository');
const AddedThreadComment = require('../../../Domains/thread_comments/entities/AddedThreadComment');
const AddThreadComment = require('../../../Domains/thread_comments/entities/AddThreadComment');

describe('AddThreadCommentUseCase', () => {
  it('should orchestrating the add thread comment action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const useCasePayload = {
      content: 'sebuah comment',
    };

    const mockAddThreadComment = new AddThreadComment(useCasePayload);
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockThreadCommentRepository.addThreadComment = jest.fn(() => Promise.resolve({
      id: 'comment-123',
      content: 'sebuah comment',
      user_id: 'user-123',
    }));

    const addThreadCommentUseCase = new AddThreadCommentUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    const addedComment = await addThreadCommentUseCase.execute(userId, threadId, useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadCommentRepository.addThreadComment).toBeCalledWith(userId, threadId, mockAddThreadComment);
    expect(addThreadCommentUseCase).toBeInstanceOf(AddThreadCommentUseCase);
    expect(addedComment).toStrictEqual(new AddedThreadComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: userId,
    }));
  });
});
