/* eslint-disable no-undef */
const AddThreadComment = require('../AddThreadComment');

describe('AddThreadComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new AddThreadComment(payload)).toThrowError('ADD_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      content: 1234,
    };

    // Action & Assert
    expect(() => new AddThreadComment(payload)).toThrowError('ADD_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should create addThreadComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'sebuah comment',
    };

    // Action
    const addThreadComment = new AddThreadComment(payload);

    // Assert
    expect(addThreadComment).toBeInstanceOf(AddThreadComment);
    expect(addThreadComment.content).toEqual(payload.content);
  });
});
