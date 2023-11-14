const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(userId, payload) {
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, user_id',
      values: [id, payload.title, payload.body, userId],
    };

    const result = await this._pool.query(query);
    return new AddedThread({
      id: result.rows[0].id,
      title: result.rows[0].title,
      owner: result.rows[0].user_id,
    });
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

    return new ThreadDetail({
      id: result.rows[0].id,
      title: result.rows[0].title,
      body: result.rows[0].body,
      date: result.rows[0].created_at,
      username: result.rows[0].username,
    });
  }
}

module.exports = ThreadRepositoryPostgres;
