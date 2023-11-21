const LogoutAuth = require('../../Domains/authentications/entities/LogoutAuth');

class LogoutUserUseCase {
  constructor({ authenticationRepository }) {
    this._authenticationRepository = authenticationRepository;
  }

  async execute(useCasePayload) {
    const { refreshToken } = new LogoutAuth(useCasePayload);
    await this._authenticationRepository.checkAvailabilityToken(refreshToken);
    await this._authenticationRepository.deleteToken(refreshToken);
  }
}

module.exports = LogoutUserUseCase;
