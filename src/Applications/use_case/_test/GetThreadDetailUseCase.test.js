/* eslint-disable no-undef */
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const ThreadCommentDetail = require('../../../Domains/thread_comments/entities/ThreadCommentDetail');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/thread_comments/ThreadCommentRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';

    const mockThreadDetail = new ThreadDetail({
      id: threadId,
      title: 'sebuah thread',
      body: 'sebuah body thread',
      createdAt: Math.floor(new Date().getTime() / 1000.0), // epoch unix
      username: 'sandy',
      comments: [],
    });
    const mockThreadCommentDetail = new ThreadCommentDetail({
      id: 'comment-123',
      username: 'sandy',
      createdAt: Math.floor(new Date().getTime() / 1000.0), // epoch unix
      deletedAt: Math.floor(new Date().getTime() / 1000.0), // epoch unix
      content: 'sebuah comment',
    });
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(mockThreadDetail));
    mockThreadCommentRepository.getCommentByThreadId = jest.fn().mockImplementation(() => Promise.resolve([mockThreadCommentDetail]));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    const getThreadDetail = await getThreadDetailUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockThreadCommentRepository.getCommentByThreadId).toBeCalledWith(threadId);
    expect(getThreadDetail.id).toBeDefined();
    expect(getThreadDetail.title).toBeDefined();
    expect(getThreadDetail.body).toBeDefined();
    expect(getThreadDetail.date).toBeDefined();
    expect(getThreadDetail.username).toBeDefined();
    expect(getThreadDetail.comments).toBeDefined();
  });
});
