/* eslint-disable no-undef */
const ThreadCommentDetail = require('../ThreadCommentDetail');

describe('a ThreadCommentDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'sandy',
      createdAt: Math.floor(new Date().getTime() / 1000.0), // epoch unix
    };

    // Action & Assert
    expect(() => new ThreadCommentDetail(payload)).toThrowError('THREAD_COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'sandy',
      createdAt: Math.floor(new Date().getTime() / 1000.0), // epoch unix
      deletedAt: null,
      content: 'sebuah comment',
    };

    // Action & Assert
    expect(() => new ThreadCommentDetail(payload)).toThrowError('THREAD_COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should display content = **komentar telah dihapus** when a comment has been deleted', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'sandy',
      createdAt: Math.floor(new Date().getTime() / 1000.0), // epoch unix
      deletedAt: Math.floor(new Date().getTime() / 1000.0), // epoch unix
      content: 'sebuah comment',
    };

    // Action
    const threadCommentDetail = new ThreadCommentDetail(payload);

    // Assert
    expect(threadCommentDetail).toBeInstanceOf(ThreadCommentDetail);
    expect(threadCommentDetail.id).toBeDefined();
    expect(threadCommentDetail.username).toBeDefined();
    expect(threadCommentDetail.date).toBeDefined();
    expect(threadCommentDetail.content).toBeDefined();
    expect(threadCommentDetail.content).toEqual('**komentar telah dihapus**');
  });

  it('should create threadCommentDetail object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'sandy',
      createdAt: Math.floor(new Date().getTime() / 1000.0), // epoch unix
      deletedAt: null,
      content: 'sebuah comment',
    };

    // Action
    const threadCommentDetail = new ThreadCommentDetail(payload);

    // Assert
    expect(threadCommentDetail).toBeInstanceOf(ThreadCommentDetail);
    expect(threadCommentDetail.id).toBeDefined();
    expect(threadCommentDetail.username).toBeDefined();
    expect(threadCommentDetail.date).toBeDefined();
    expect(threadCommentDetail.content).toBeDefined();
    expect(threadCommentDetail.content).toEqual(payload.content);
  });
});
