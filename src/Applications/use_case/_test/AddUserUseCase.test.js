/* eslint-disable no-undef */
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../../Domains/users/UserRepository');
const PasswordHash = require('../../security/PasswordHash');
const AddUserUseCase = require('../AddUserUseCase');

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'sandy',
      password: 'secret',
      fullname: 'Sandy Dwi',
    };

    const mockRegisterUser = new RegisterUser(useCasePayload);
    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    mockUserRepository.verifyAvailableUsername = jest.fn(() => Promise.resolve());
    mockPasswordHash.hash = jest.fn(() => Promise.resolve('encrypted_password'));
    mockUserRepository.addUser = jest.fn(() => Promise.resolve(new RegisteredUser({
      id: 'user-123',
      username: 'sandy',
      fullname: 'Sandy Dwi',
    })));

    const addUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    // Action
    const registeredUser = await addUserUseCase.execute(useCasePayload);

    // Assert
    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(mockRegisterUser.username);
    expect(mockPasswordHash.hash).toBeCalledWith(mockRegisterUser.password);
    expect(mockUserRepository.addUser).toBeCalledWith(new RegisterUser({
      username: mockRegisterUser.username,
      password: 'encrypted_password',
      fullname: mockRegisterUser.fullname,
    }));
    expect(addUserUseCase).toBeInstanceOf(AddUserUseCase);
    expect(registeredUser).toStrictEqual(new RegisteredUser({
      id: 'user-123',
      username: mockRegisterUser.username,
      fullname: mockRegisterUser.fullname,
    }));
  });
});
