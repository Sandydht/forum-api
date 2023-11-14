/* eslint-disable no-undef */
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    const threadId = 'thread-123';

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(new ThreadDetail({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date('2023-10-14').toISOString(),
      username: 'sandy',
    })));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const thread = await getThreadDetailUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(getThreadDetailUseCase).toBeInstanceOf(GetThreadDetailUseCase);
    expect(thread).toStrictEqual(new ThreadDetail({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date('2023-10-14').toISOString(),
      username: 'sandy',
    }));
  });
});
