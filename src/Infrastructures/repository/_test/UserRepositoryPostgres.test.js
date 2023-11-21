/* eslint-disable no-undef */
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'sandy' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('sandy')).rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('sandy')).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should persist register user and return registered user correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const payload = {
        username: 'sandy',
        fullname: 'Sandy Dwi',
        password: 'secret',
      };

      // Action
      await userRepositoryPostgres.addUser(payload);

      // Assert
      const users = await UsersTableTestHelper.findUsersById('user-123');
      expect(users).toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const payload = {
        username: 'sandy',
        fullname: 'Sandy Dwi',
        password: 'secret',
      };

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(payload);

      // Assert
      expect(registeredUser.id).toEqual('user-123');
      expect(registeredUser.username).toEqual(payload.username);
      expect(registeredUser.fullname).toEqual(payload.fullname);
    });
  });

  describe('getPasswordByUsername function', () => {
    it('should throw InvariantError when user not found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.getPasswordByUsername('sandy')).rejects.toThrowError(InvariantError);
    });

    it('should return password when user is found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'sandy',
        password: 'secret',
      });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const password = await userRepositoryPostgres.getPasswordByUsername('sandy');

      // Assert
      expect(password).toBe('secret');
    });
  });

  describe('getIdByUsername function', () => {
    it('should throw InvariantError when user not found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.getIdByUsername('sandy')).rejects.toThrowError(InvariantError);
    });

    it('should return user id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'sandy' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const userId = await userRepositoryPostgres.getIdByUsername('sandy');

      // Assert
      expect(userId).toEqual('user-321');
    });
  });
});
