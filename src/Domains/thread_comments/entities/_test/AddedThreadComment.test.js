/* eslint-disable no-undef */
const AddedThreadComment = require('../AddedThreadComment');

describe('AddedThreadComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'sebuah comment',
    };

    // Action & Assert
    expect(() => new AddedThreadComment(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 1234,
    };

    // Action & Assert
    expect(() => new AddedThreadComment(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should create addedThreadComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    };

    // Action
    const addedThreadComment = new AddedThreadComment(payload);

    // Assert
    expect(addedThreadComment).toBeInstanceOf(AddedThreadComment);
    expect(addedThreadComment.id).toEqual(payload.id);
    expect(addedThreadComment.content).toEqual(payload.content);
    expect(addedThreadComment.owner).toEqual(payload.owner);
  });
});
