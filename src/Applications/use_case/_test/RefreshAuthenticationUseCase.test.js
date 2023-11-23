/* eslint-disable no-undef */
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const RefreshAuthenticationUseCase = require('../RefreshAuthenticationUseCase');
const RefreshAuth = require('../../../Domains/authentications/entities/RefreshAuth');

describe('RefreshAuthenticationUseCase', () => {
  it('should orchestrating the refresh authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'some_refresh_token',
    };

    const mockRefreshAuth = new RefreshAuth(useCasePayload);
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    mockAuthenticationRepository.checkAvailabilityToken = jest.fn(() => Promise.resolve());
    mockAuthenticationTokenManager.verifyRefreshToken = jest.fn(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest.fn(() => Promise.resolve({ id: 'user-123', username: 'sandy' }));
    mockAuthenticationTokenManager.createAccessToken = jest.fn(() => Promise.resolve('some_new_access_token'));

    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const refreshToken = await refreshAuthenticationUseCase.execute(useCasePayload);

    // Assert
    expect(mockAuthenticationRepository.checkAvailabilityToken).toBeCalledWith(mockRefreshAuth.refreshToken);
    expect(mockAuthenticationTokenManager.verifyRefreshToken).toBeCalledWith(mockRefreshAuth.refreshToken);
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(mockRefreshAuth.refreshToken);
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({ id: 'user-123', username: 'sandy' });
    expect(refreshAuthenticationUseCase).toBeInstanceOf(RefreshAuthenticationUseCase);
    expect(refreshToken).toEqual('some_new_access_token');
  });
});
