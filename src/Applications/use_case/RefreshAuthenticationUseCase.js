const RefreshAuth = require('../../Domains/authentications/entities/RefreshAuth');

class RefreshAuthenticationUseCase {
  constructor({
    authenticationRepository,
    authenticationTokenManager,
  }) {
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload) {
    const { refreshToken } = new RefreshAuth(useCasePayload);
    await this._authenticationTokenManager.verifyRefreshToken(refreshToken);
    await this._authenticationRepository.checkAvailabilityToken(refreshToken);
    const { username, id } = await this._authenticationTokenManager.decodePayload(refreshToken);
    return this._authenticationTokenManager.createAccessToken({ username, id });
  }
}

module.exports = RefreshAuthenticationUseCase;
