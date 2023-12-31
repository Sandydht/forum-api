/* eslint-disable no-undef */
const ThreadCommentRepository = require('../ThreadCommentRepository');

describe('ThreadCommentRepository', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadCommentRepository = new ThreadCommentRepository();

    // Action & Assert
    expect(threadCommentRepository).toBeInstanceOf(ThreadCommentRepository);
    await expect(threadCommentRepository.addThreadComment('', '', {})).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadCommentRepository.verifyAvailableThreadComment('')).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadCommentRepository.verifyAvailableThreadCommentByUser('', '')).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadCommentRepository.deleteThreadComment('')).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadCommentRepository.getThreadCommentsByThreadId('')).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
