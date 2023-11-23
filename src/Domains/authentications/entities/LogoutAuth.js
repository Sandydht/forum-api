class LogoutAuth {
  constructor(payload) {
    this._verifyPayload(payload);

    const { refreshToken } = payload;
    this.refreshToken = refreshToken;
  }

  _verifyPayload({ refreshToken }) {
    if (!refreshToken) {
      throw new Error('LOGOUT_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('LOGOUT_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LogoutAuth;
