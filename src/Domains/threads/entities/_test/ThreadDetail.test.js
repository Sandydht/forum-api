/* eslint-disable no-undef */
const ThreadDetail = require('../ThreadDetail');

describe('a ThreadDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      createdAt: Math.floor(new Date().getTime() / 1000.0), // epoch unix
      username: 'sandy',
    };

    // Action & Assert
    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'sebuah thread',
      body: 'sebuah body thread',
      createdAt: '2021-08-08T07:19:09.775Z',
      username: 'sandy',
      comments: [],
    };

    // Action & Assert
    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should create threadDetail object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      createdAt: Math.floor(new Date().getTime() / 1000.0), // epoch unix
      username: 'sandy',
      comments: [],
    };

    // Action
    const threadDetail = new ThreadDetail(payload);

    // Assert
    expect(threadDetail).toBeInstanceOf(ThreadDetail);
    expect(threadDetail.id).toBeDefined();
    expect(threadDetail.title).toBeDefined();
    expect(threadDetail.body).toBeDefined();
    expect(threadDetail.date).toBeDefined();
    expect(threadDetail.comments).toBeDefined();
  });
});
