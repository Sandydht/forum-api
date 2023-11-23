/* eslint-disable no-undef */
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const LogoutUserUseCase = require('../LogoutUserUseCase');
const LogoutAuth = require('../../../Domains/authentications/entities/LogoutAuth');

describe('LogoutUserUseCase', () => {
  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refreshToken',
    };

    const mockLogoutAuth = new LogoutAuth(useCasePayload);
    const mockAuthenticationRepository = new AuthenticationRepository();

    mockAuthenticationRepository.checkAvailabilityToken = jest.fn(() => Promise.resolve());
    mockAuthenticationRepository.deleteToken = jest.fn(() => Promise.resolve());

    const logoutUserUseCase = new LogoutUserUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Action
    await logoutUserUseCase.execute(useCasePayload);

    // Assert
    expect(mockAuthenticationRepository.checkAvailabilityToken).toBeCalledWith(mockLogoutAuth.refreshToken);
    expect(mockAuthenticationRepository.deleteToken).toBeCalledWith(mockLogoutAuth.refreshToken);
  });
});
