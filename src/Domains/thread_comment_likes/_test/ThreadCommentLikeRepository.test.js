/* eslint-disable no-undef */
const ThreadCommentLikeRepository = require('../ThreadCommentLikeRepository');

describe('ThreadCommentLikeRepository', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadCommentLikeRepository = new ThreadCommentLikeRepository();

    // Action & Assert
    expect(threadCommentLikeRepository).toBeInstanceOf(ThreadCommentLikeRepository);
    await expect(threadCommentLikeRepository.addThreadCommentLike('', '', '')).rejects.toThrowError('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadCommentLikeRepository.deleteThreadCommentLike('')).rejects.toThrowError('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadCommentLikeRepository.getIdAvailableThreadCommentLike('', '', '')).rejects.toThrowError('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
