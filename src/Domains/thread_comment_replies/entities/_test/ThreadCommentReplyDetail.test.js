/* eslint-disable no-undef */
const ThreadCommentReplyDetail = require('../ThreadCommentReplyDetail');

describe('ThreadCommentReplyDetail', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'sandy',
      date: new Date('2023-10-14'),
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
      date: new Date('2023-10-14'),
      content: 'sebuah balasan',
      isDelete: false,
    };

    // Action & Assert
    expect(() => new ThreadCommentReplyDetail(payload)).toThrowError('THREAD_COMMENT_REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should show content when comment is not deleted', () => {
    // Arrange
    const reply1 = {
      id: 'reply-123',
      username: 'sandy',
      date: new Date('2023-10-14'),
      content: 'sebuah balasan',
      isDelete: false,
    };

    const reply2 = {
      id: 'reply-123',
      username: 'sandy',
      date: new Date('2023-10-14'),
      content: 'sebuah balasan',
      isDelete: true,
    };

    // Action
    const threadCommentReplyDetail1 = new ThreadCommentReplyDetail(reply1);
    const threadCommentReplyDetail2 = new ThreadCommentReplyDetail(reply2);

    // Assert
    expect(threadCommentReplyDetail1).toBeInstanceOf(ThreadCommentReplyDetail);
    expect(threadCommentReplyDetail1.id).toEqual(reply1.id);
    expect(threadCommentReplyDetail1.username).toEqual(reply1.username);
    expect(threadCommentReplyDetail1.date).toEqual(reply1.date.toISOString());
    expect(threadCommentReplyDetail1.content).toEqual(reply1.content);

    expect(threadCommentReplyDetail2).toBeInstanceOf(ThreadCommentReplyDetail);
    expect(threadCommentReplyDetail2.id).toEqual(reply2.id);
    expect(threadCommentReplyDetail2.username).toEqual(reply2.username);
    expect(threadCommentReplyDetail2.date).toEqual(reply2.date.toISOString());
    expect(threadCommentReplyDetail2.content).toEqual('**balasan telah dihapus**');
  });
});
