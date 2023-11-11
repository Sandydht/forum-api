/* eslint-disable no-undef */
const ThreadCommentReplyDetail = require('../ThreadCommentReplyDetail');

describe('a ThreadCommentReplyDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'sandy',
      createdAt: Math.floor(new Date().getTime() / 1000.0), // epoch unix
    };

    // Action & Assert
    expect(() => new ThreadCommentReplyDetail(payload)).toThrowError('THREAD_COMMENT_REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'sandy',
      createdAt: Math.floor(new Date().getTime() / 1000.0), // epoch unix
      deletedAt: null,
      content: 'sebuah balasan',
    };

    // Action & Assert
    expect(() => new ThreadCommentReplyDetail(payload)).toThrowError('THREAD_COMMENT_REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should display content = **balasan telah dihapus** when a reply has been deleted', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'sandy',
      createdAt: Math.floor(new Date().getTime() / 1000.0), // epoch unix
      deletedAt: Math.floor(new Date().getTime() / 1000.0), // epoch unix
      content: 'sebuah balasan',
    };

    // Action
    const threadCommentReplyDetail = new ThreadCommentReplyDetail(payload);

    // Assert
    expect(threadCommentReplyDetail).toBeInstanceOf(ThreadCommentReplyDetail);
    expect(threadCommentReplyDetail.id).toBeDefined();
    expect(threadCommentReplyDetail.username).toBeDefined();
    expect(threadCommentReplyDetail.date).toBeDefined();
    expect(threadCommentReplyDetail.content).toBeDefined();
    expect(threadCommentReplyDetail.content).toEqual('**balasan telah dihapus**');
  });

  it('should create threadCommentReplyDetail object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'sandy',
      createdAt: Math.floor(new Date().getTime() / 1000.0), // epoch unix
      deletedAt: null,
      content: 'sebuah balasan',
    };

    // Action
    const threadCommentReplyDetail = new ThreadCommentReplyDetail(payload);

    // Assert
    expect(threadCommentReplyDetail).toBeInstanceOf(ThreadCommentReplyDetail);
    expect(threadCommentReplyDetail.id).toBeDefined();
    expect(threadCommentReplyDetail.username).toBeDefined();
    expect(threadCommentReplyDetail.date).toBeDefined();
    expect(threadCommentReplyDetail.content).toBeDefined();
    expect(threadCommentReplyDetail.content).toEqual(payload.content);
  });
});
