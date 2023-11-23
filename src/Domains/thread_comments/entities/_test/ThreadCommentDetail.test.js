/* eslint-disable no-undef */
const ThreadCommentDetail = require('../ThreadCommentDetail');

describe('a ThreadCommentDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'sandy',
      date: new Date('2023-10-14'),
    };

    // Action & Assert
    expect(() => new ThreadCommentDetail(payload)).toThrowError('THREAD_COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'sandy',
      date: new Date('2023-10-14'),
      content: 'sebuah comment',
      isDelete: false,
    };

    // Action & Assert
    expect(() => new ThreadCommentDetail(payload)).toThrowError('THREAD_COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should show content when comment is not deleted', () => {
    // Arrange
    const comment1 = {
      id: 'comment-123',
      username: 'sandy',
      date: new Date('2023-10-14'),
      content: 'sebuah comment',
      isDelete: false,
    };

    const comment2 = {
      id: 'comment-123',
      username: 'sandy',
      date: new Date('2023-10-14'),
      content: 'sebuah comment',
      isDelete: true,
    };

    // Action
    const threadCommentDetail1 = new ThreadCommentDetail(comment1);
    const threadCommentDetail2 = new ThreadCommentDetail(comment2);

    // Assert
    expect(threadCommentDetail1).toBeInstanceOf(ThreadCommentDetail);
    expect(threadCommentDetail1.id).toEqual(comment1.id);
    expect(threadCommentDetail1.username).toEqual(comment1.username);
    expect(threadCommentDetail1.date).toEqual(comment1.date.toISOString());
    expect(threadCommentDetail1.content).toEqual(comment1.content);

    expect(threadCommentDetail2).toBeInstanceOf(ThreadCommentDetail);
    expect(threadCommentDetail2.id).toEqual(comment2.id);
    expect(threadCommentDetail2.username).toEqual(comment2.username);
    expect(threadCommentDetail2.date).toEqual(comment2.date.toISOString());
    expect(threadCommentDetail2.content).toEqual('**komentar telah dihapus**');
  });
});
