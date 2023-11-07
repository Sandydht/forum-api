const autoBind = require('auto-bind');
const LoginUserUseCase = require('../../../../Applications/use_case/LoginUserUseCase');

class AuthenticationsHandler {
  constructor(container) {
    this._container = container;
    autoBind(this);
  }

  async postAuthenticationHandler(request, h) {
    const loginUserUseCase = this._container.getInstance(LoginUserUseCase.name);
    const { accessToken, refreshToken } = await loginUserUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = AuthenticationsHandler;
