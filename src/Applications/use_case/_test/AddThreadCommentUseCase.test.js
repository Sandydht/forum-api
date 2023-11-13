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

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.addThreadComment = jest.fn().mockImplementation(() => Promise.resolve(new AddedThreadComment({
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    })));

    const addThreadCommentUseCase = new AddThreadCommentUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    const addedComment = await addThreadCommentUseCase.execute(userId, threadId, useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(addThreadCommentUseCase).toBeInstanceOf(AddThreadCommentUseCase);
    expect(mockThreadCommentRepository.addThreadComment).toBeCalledWith(userId, threadId, new AddThreadComment({
      content: 'sebuah comment',
    }));
    expect(addedComment).toStrictEqual(new AddedThreadComment({
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    }));
  });
});
