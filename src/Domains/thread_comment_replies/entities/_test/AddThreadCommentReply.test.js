/* eslint-disable no-undef */
const AddThreadCommentReply = require('../AddThreadCommentReply');

describe('AddReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new AddThreadCommentReply(payload)).toThrowError('ADD_THREAD_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      content: 123,
    };

    // Action & Assert
    expect(() => new AddThreadCommentReply(payload)).toThrowError('ADD_THREAD_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should create addThreadCommentReply object correctly', () => {
    // Arrange
    const payload = {
      content: 'sebuah balasan',
    };

    // Action
    const addThreadCommentReply = new AddThreadCommentReply(payload);

    // Assert
    expect(addThreadCommentReply).toBeInstanceOf(AddThreadCommentReply);
    expect(addThreadCommentReply.content).toEqual(payload.content);
  });
});
