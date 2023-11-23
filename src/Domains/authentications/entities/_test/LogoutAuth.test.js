/* eslint-disable no-undef */
const LogoutAuth = require('../LogoutAuth');

describe('LogoutAuth entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new LogoutAuth(payload)).toThrowError('LOGOUT_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      refreshToken: 123,
    };

    // Action & Assert
    expect(() => new LogoutAuth(payload)).toThrowError('LOGOUT_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create LogoutAuth object correctly', () => {
    // Arrange
    const payload = {
      refreshToken: 'refreshToken',
    };

    // Action
    const logoutAuth = new LogoutAuth(payload);

    // Assert
    expect(logoutAuth).toBeInstanceOf(LogoutAuth);
    expect(logoutAuth.refreshToken).toEqual(payload.refreshToken);
  });
});
