/* eslint-disable no-undef */
const AddThreadComment = require('../AddThreadComment');

xdescribe('AddThreadComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new AddThreadComment(payload)).toThrowError('ADD_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });
});
