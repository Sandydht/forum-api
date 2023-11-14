/* eslint-disable no-undef */
const AddedThreadCommentReply = require('../AddedThreadCommentReply');

describe('AddedThreadCommentReply', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'sebuah balasan',
    };

    // Action & Assert
    expect(() => new AddedThreadCommentReply(payload)).toThrowError('ADDED_THREAD_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'sebuah balasan',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new AddedThreadCommentReply(payload)).toThrowError('ADDED_THREAD_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should create addedThreadCommentReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'sebuah balasan',
      owner: 'user-123',
    };

    // Action
    const addedReply = new AddedThreadCommentReply(payload);

    // Assert
    expect(addedReply).toBeInstanceOf(AddedThreadCommentReply);
    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.owner).toEqual(payload.owner);
  });
});
