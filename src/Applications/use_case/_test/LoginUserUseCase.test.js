/* eslint-disable no-undef */
const UserRepository = require('../../../Domains/users/UserRepository');
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const PasswordHash = require('../../security/PasswordHash');
const LoginUserUseCase = require('../LoginUserUseCase');
const NewAuth = require('../../../Domains/authentications/entities/NewAuth');

describe('GetAuthenticationUseCase', () => {
  it('should orchestrating the get authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'sandy',
      password: 'secret',
    };

    const mockNewAuth = new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });
    const mockUserRepository = new UserRepository();
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockPasswordHash = new PasswordHash();

    mockUserRepository.getPasswordByUsername = jest.fn().mockImplementation(() => Promise.resolve('encrypted_password'));
    mockPasswordHash.comparePassword = jest.fn().mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.createAccessToken = jest.fn().mockImplementation(() => Promise.resolve(mockNewAuth.accessToken));
    mockAuthenticationTokenManager.createRefreshToken = jest.fn().mockImplementation(() => Promise.resolve(mockNewAuth.refreshToken));
    mockUserRepository.getIdByUsername = jest.fn().mockImplementation(() => Promise.resolve('user-123'));
    mockAuthenticationRepository.addToken = jest.fn().mockImplementation(() => Promise.resolve());

    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });

    // Action
    const loggedIn = await loginUserUseCase.execute(useCasePayload);

    // Assert
    expect(mockUserRepository.getPasswordByUsername).toBeCalledWith(useCasePayload.username);
    expect(mockPasswordHash.comparePassword).toBeCalledWith(useCasePayload.password, 'encrypted_password');
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({ username: useCasePayload.username, id: 'user-123' });
    expect(mockAuthenticationTokenManager.createRefreshToken).toBeCalledWith({ username: useCasePayload.username, id: 'user-123' });
    expect(mockUserRepository.getIdByUsername).toBeCalledWith(useCasePayload.username);
    expect(mockAuthenticationRepository.addToken).toBeCalledWith('refresh_token');
    expect(loggedIn).toStrictEqual(new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    }));
  });
});
