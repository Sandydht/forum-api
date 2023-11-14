/* eslint-disable no-undef */
const ThreadCommentReplyDetail = require('../ThreadCommentReplyDetail');

describe('ThreadCommentReplyDetail', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'sandy',
      date: Math.floor(new Date().getTime() / 1000.0), // epoch
      content: 'sebuah balasan',
    };

    // Action & Assert
    expect(() => new ThreadCommentReplyDetail(payload)).toThrowError('THREAD_COMMENT_REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'sandy',
      date: Math.floor(new Date().getTime() / 1000.0), // epoch
      content: 'sebuah balasan',
      isDelete: false,
    };

    // Action & Assert
    expect(() => new ThreadCommentReplyDetail(payload)).toThrowError('THREAD_COMMENT_REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should show (content = **balasan telah dihapus**) when comment is deleted', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'sandy',
      date: Math.floor(new Date().getTime() / 1000.0), // epoch
      content: 'sebuah balasan',
      isDelete: true,
    };

    // Action
    const threadCommentReplyDetail = new ThreadCommentReplyDetail(payload);

    // Assert
    expect(threadCommentReplyDetail).toBeInstanceOf(ThreadCommentReplyDetail);
    expect(threadCommentReplyDetail.id).toEqual(payload.id);
    expect(threadCommentReplyDetail.username).toEqual(payload.username);
    expect(threadCommentReplyDetail.date).toEqual(new Date(payload.date).toISOString());
    expect(threadCommentReplyDetail.content).toEqual('**balasan telah dihapus**');
  });

  it('should show content when comment is not deleted', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'sandy',
      date: Math.floor(new Date().getTime() / 1000.0), // epoch
      content: 'sebuah balasan',
      isDelete: false,
    };

    // Action
    const threadCommentReplyDetail = new ThreadCommentReplyDetail(payload);

    // Assert
    expect(threadCommentReplyDetail).toBeInstanceOf(ThreadCommentReplyDetail);
    expect(threadCommentReplyDetail.id).toEqual(payload.id);
    expect(threadCommentReplyDetail.username).toEqual(payload.username);
    expect(threadCommentReplyDetail.date).toEqual(new Date(payload.date).toISOString());
    expect(threadCommentReplyDetail.content).toEqual(payload.content);
  });
});
