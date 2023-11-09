/* eslint-disable no-undef */
const ThreadCommentRepository = require('../ThreadCommentRepository');

describe('ThreadCommentRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadCommentRepository = new ThreadCommentRepository();

    // Action & Assert
    expect(threadCommentRepository).toBeInstanceOf(ThreadCommentRepository);
    await expect(threadCommentRepository.addThreadComment({})).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});