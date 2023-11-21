/* eslint-disable no-undef */
const AddThreadUseCase = require('../AddThreadUseCase');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
    };

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn(() => Promise.resolve());

    // // Arrange
    // const userId = 'user-123';
    // const useCasePayload = {
    //   title: 'sebuah thread',
    //   body: 'sebuah body thread',
    // };

    // const mockThreadRepository = new ThreadRepository();

    // mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(new AddedThread({
    //   id: 'thread-123',
    //   title: 'sebuah thread',
    //   owner: 'user-123',
    // })));

    // const addThreadUseCase = new AddThreadUseCase({
    //   threadRepository: mockThreadRepository,
    // });

    // // Action
    // const addedThread = await addThreadUseCase.execute(userId, useCasePayload);

    // // Assert
    // expect(mockThreadRepository.addThread).toBeCalledWith(userId, new AddThread({
    //   title: useCasePayload.title,
    //   body: useCasePayload.body,
    // }));
    // expect(addThreadUseCase).toBeInstanceOf(AddThreadUseCase);
    // expect(addedThread).toStrictEqual(new AddedThread({
    //   id: 'thread-123',
    //   title: 'sebuah thread',
    //   owner: 'user-123',
    // }));
  });
});
