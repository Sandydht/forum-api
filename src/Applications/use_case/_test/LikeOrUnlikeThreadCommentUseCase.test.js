/* eslint-disable no-undef */
const LikeOrUnlikeThreadCommentUseCase = require('../LikeOrUnlikeThreadCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/thread_comments/ThreadCommentRepository');
const ThreadCommentLikeRepository = require('../../../Domains/thread_comment_likes/ThreadCommentLikeRepository');

describe('LikeOrUnlikeThreadCommentUseCase', () => {
  it('should orchestrating the like thread comment action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadCommentLikeRepository = new ThreadCommentLikeRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockThreadCommentRepository.verifyAvailableThreadComment = jest.fn(() => Promise.resolve());
    mockThreadCommentLikeRepository.getIdAvailableThreadCommentLike = jest.fn(() => Promise.resolve(null));
    mockThreadCommentLikeRepository.addThreadCommentLike = jest.fn(() => Promise.resolve('Liked'));

    const likeOrUnlikeThreadCommentUseCase = new LikeOrUnlikeThreadCommentUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      threadCommentLikeRepository: mockThreadCommentLikeRepository,
    });

    // Action
    const likedOrUnlikedThreadComment = await likeOrUnlikeThreadCommentUseCase.execute(userId, threadId, commentId);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadCommentRepository.verifyAvailableThreadComment).toBeCalledWith(commentId);
    expect(mockThreadCommentLikeRepository.getIdAvailableThreadCommentLike).toBeCalledWith(userId, threadId, commentId);
    await expect(mockThreadCommentLikeRepository.getIdAvailableThreadCommentLike()).resolves.toBeNull();
    expect(mockThreadCommentLikeRepository.addThreadCommentLike).toBeCalledWith(userId, threadId, commentId);
    expect(likedOrUnlikedThreadComment).toEqual('Liked');
  });

  it('should orchestrating the unlike thread comment action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadCommentLikeRepository = new ThreadCommentLikeRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockThreadCommentRepository.verifyAvailableThreadComment = jest.fn(() => Promise.resolve());
    mockThreadCommentLikeRepository.getIdAvailableThreadCommentLike = jest.fn(() => Promise.resolve('comment-like-123'));
    mockThreadCommentLikeRepository.deleteThreadCommentLike = jest.fn(() => Promise.resolve('Unliked'));

    const likeOrUnlikeThreadCommentUseCase = new LikeOrUnlikeThreadCommentUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      threadCommentLikeRepository: mockThreadCommentLikeRepository,
    });

    // Action
    const likedOrUnlikedThreadComment = await likeOrUnlikeThreadCommentUseCase.execute(userId, threadId, commentId);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadCommentRepository.verifyAvailableThreadComment).toBeCalledWith(commentId);
    expect(mockThreadCommentLikeRepository.getIdAvailableThreadCommentLike).toBeCalledWith(userId, threadId, commentId);
    await expect(mockThreadCommentLikeRepository.getIdAvailableThreadCommentLike()).resolves.toEqual('comment-like-123');
    expect(mockThreadCommentLikeRepository.deleteThreadCommentLike).toBeCalledWith('comment-like-123');
    expect(likedOrUnlikedThreadComment).toEqual('Unliked');
  });
});
