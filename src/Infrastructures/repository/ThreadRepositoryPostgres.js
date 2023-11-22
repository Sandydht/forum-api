const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(userId, payload) {
    const id = `thread-${this._idGenerator()}`;
    const { title, body } = payload;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, user_id',
      values: [id, title, body, userId],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async verifyAvailableThread(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
  }

  async getThreadById(id) {
    const query = {
      text: 'SELECT threads.id, threads.title, threads.body, threads.created_at, users.username FROM threads INNER JOIN users ON threads.user_id = users.id WHERE threads.id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak ditemukan');
    }

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
