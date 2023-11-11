/* eslint-disable no-undef */
const ThreadCommentReplyRepository = require('../ThreadCommentReplyRepository');

describe('ThreadCommentReplyRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadCommentReplyRepository = new ThreadCommentReplyRepository();

    // Action & Assert
    expect(threadCommentReplyRepository).toBeInstanceOf(ThreadCommentReplyRepository);
    await expect(threadCommentReplyRepository.addThreadCommentReply('', '', '', {})).rejects.toThrowError('THREAD_COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadCommentReplyRepository.getRepliesByThread('', '')).rejects.toThrowError('THREAD_COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadCommentReplyRepository.verifyAvalilableThreadCommentReply('')).rejects.toThrowError('THREAD_COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadCommentReplyRepository.verifyAvalilableThreadCommentReplyByUser('', '')).rejects.toThrowError('THREAD_COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadCommentReplyRepository.deleteThreadCommentReply('')).rejects.toThrowError('THREAD_COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});