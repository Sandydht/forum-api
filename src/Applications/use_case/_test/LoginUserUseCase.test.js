/* eslint-disable no-undef */
const UserRepository = require('../../../Domains/users/UserRepository');
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const PasswordHash = require('../../security/PasswordHash');
const LoginUserUseCase = require('../LoginUserUseCase');
const NewAuth = require('../../../Domains/authentications/entities/NewAuth');
const UserLogin = require('../../../Domains/users/entities/UserLogin');

describe('GetAuthenticationUseCase', () => {
  it('should orchestrating the get authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'sandy',
      password: 'secret',
    };

    const mockUserLogin = new UserLogin(useCasePayload);
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
    mockAuthenticationTokenManager.createAccessToken = jest.fn().mockImplementation(() => Promise.resolve('access_token'));
    mockAuthenticationTokenManager.createRefreshToken = jest.fn().mockImplementation(() => Promise.resolve('refresh_token'));
    mockUserRepository.getIdByUsername = jest.fn().mockImplementation(() => Promise.resolve('user-123'));
    mockAuthenticationRepository.addToken = jest.fn().mockImplementation(() => Promise.resolve());

    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });

    // Action
    const loggedIn = await loginUserUseCase.execute(mockUserLogin);

    // Assert
    expect(mockUserRepository.getIdByUsername).toBeCalledWith(mockUserLogin.username);
    expect(mockPasswordHash.comparePassword).toBeCalledWith(mockUserLogin.password, 'encrypted_password');
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({ id: 'user-123', username: mockUserLogin.username });
    expect(mockAuthenticationTokenManager.createRefreshToken).toBeCalledWith({ id: 'user-123', username: mockUserLogin.username });
    expect(mockUserRepository.getIdByUsername).toBeCalledWith(mockUserLogin.username);
    expect(mockAuthenticationRepository.addToken).toBeCalledWith(mockNewAuth.refreshToken);
    expect(loginUserUseCase).toBeInstanceOf(LoginUserUseCase);
    expect(loggedIn).toStrictEqual(mockNewAuth);
  });
});
