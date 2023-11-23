/* eslint-disable no-undef */
const RefreshAuth = require('../RefreshAuth');

describe('RefreshAuth entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new RefreshAuth(payload)).toThrowError('REFRESH_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      refreshToken: 123,
    };

    // Action & Assert
    expect(() => new RefreshAuth(payload)).toThrowError('REFRESH_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create RefreshAuth object correctly', () => {
    // Arrange
    const payload = {
      refreshToken: 'refreshToken',
    };

    // Action
    const refreshAuth = new RefreshAuth(payload);

    // Assert
    expect(refreshAuth).toBeInstanceOf(RefreshAuth);
    expect(refreshAuth.refreshToken).toEqual(payload.refreshToken);
  });
});
