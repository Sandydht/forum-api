/* eslint-disable no-undef */
const ThreadDetail = require('../ThreadDetail');

describe('a ThreadDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: Math.floor(new Date().getTime() / 1000.0), // epoch
    };

    // Assert
    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: Math.floor(new Date().getTime() / 1000.0), // epoch
      username: 'sandy',
    };

    // Assert
    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create threadDetail object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: Math.floor(new Date().getTime() / 1000.0), // epoch
      username: 'sandy',
    };

    // Action
    const thread = new ThreadDetail(payload);

    // Assert
    expect(thread).toBeInstanceOf(ThreadDetail);
    expect(thread.id).toEqual(payload.id);
    expect(thread.title).toEqual(payload.title);
    expect(thread.body).toEqual(payload.body);
    expect(thread.date).toEqual(new Date(payload.date).toISOString());
    expect(thread.username).toEqual(payload.username);
  });
});
