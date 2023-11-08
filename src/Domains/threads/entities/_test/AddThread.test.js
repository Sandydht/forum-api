/* eslint-disable no-undef */
const AddThread = require('../AddThread');

describe('AddThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread',
    };

    // Action & Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type spesification', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread',
      body: {},
    };

    // Action & Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should create AddThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
    };

    // Action
    const addThread = new AddThread(payload);

    // Assert
    expect(addThread).toBeInstanceOf(AddThread);
    expect(addThread.title).toEqual(payload.title);
    expect(addThread.body).toEqual(payload.body);
  });
});