/* eslint-disable no-undef */
const AddThreadUseCase = require('../AddThreadUseCase');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThread = require('../../../Domains/threads/entities/AddThread');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
    };

    // Mock
    const mockAddThread = new AddThread(useCasePayload);
    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: userId,
    });
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(mockAddedThread));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(userId, mockAddThread);

    // Assert
    expect(addThreadUseCase).toBeInstanceOf(AddThreadUseCase);
    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: userId,
    }));
    expect(mockThreadRepository.addThread).toBeCalledWith(userId, mockAddThread);
  });
});
