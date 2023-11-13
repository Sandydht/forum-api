/* eslint-disable no-undef */
const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action & Assert
    expect(threadRepository).toBeInstanceOf(ThreadRepository);
    await expect(threadRepository.addThread('', {})).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
