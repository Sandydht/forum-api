/* eslint-disable no-undef */
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('UserRepositoryPostgres', () => {
  let userRepositoryPostgres = null;
  const fakeIdGenerator = () => '123';

  beforeAll(() => {
    userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'sandy' });

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('sandy')).rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when username not available', async () => {
      // Arrange & Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('sandy')).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should persist register user and return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'sandy',
        password: 'secret',
        fullname: 'Sandy Dwi',
      });

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUsersById('user-123');
      expect(users).toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'sandy',
        password: 'secret',
        fullname: 'Sandy Dwi',
      });

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      // Assert
      expect(registeredUser).toStrictEqual(new RegisteredUser({
        id: 'user-123',
        username: registerUser.username,
        fullname: registerUser.fullname,
      }));
    });
  });

  describe('getPasswordByUsername function', () => {
    it('should throw InvariantError when user not found', async () => {
      // Arrange & Action & Assert
      await expect(userRepositoryPostgres.getPasswordByUsername('sandy')).rejects.toThrowError(InvariantError);
    });

    it('should return username password when user is found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'sandy',
        password: 'secret',
      });

      // Action & Assert
      const password = await userRepositoryPostgres.getPasswordByUsername('sandy');
      expect(password).toBe('secret');
    });
  });

  describe('getIdByUsername function', () => {
    it('should throw InvariantError when user not found', async () => {
      // Arrange Action & Assert
      await expect(userRepositoryPostgres.getIdByUsername('sandy')).rejects.toThrowError(InvariantError);
    });

    it('should return user id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'sandy' });

      // Action
      const userId = await userRepositoryPostgres.getIdByUsername('sandy');

      // Assert
      expect(userId).toEqual('user-321');
    });
  });
});
