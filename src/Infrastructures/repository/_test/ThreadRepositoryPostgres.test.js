/* eslint-disable no-undef */
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  let threadRepositoryPostgres = null;
  const fakeIdGenerator = () => '123';

  beforeAll(() => {
    threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const addThread = new AddThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
      });

      // Action
      await threadRepositoryPostgres.addThread('user-123', addThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const addThread = new AddThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
      });

      // Action
      const addedThread = await threadRepositoryPostgres.addThread('user-123', addThread);

      // Assert
      expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepositoryPostgres);
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'sebuah thread',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError when thread not available', async () => {
      // Arrange & Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'sandy' });

      // Action & Assert
      return expect(threadRepositoryPostgres.getThreadById('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('shoul return thread detail when thread is found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'sandy' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        userId: 'user-123',
        createdAt: new Date('2023-11-14T13:00:00.000Z'),
      });

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(thread.id).toEqual('thread-123');
      expect(thread.title).toEqual('sebuah thread');
      expect(thread.body).toEqual('sebuah body thread');
      expect(thread.date).toEqual(new Date('2023-11-14T13:00:00.000Z').toISOString());
      expect(thread.username).toEqual('sandy');
      expect(thread.comments).toBeInstanceOf(Array);
    });
  });
});
