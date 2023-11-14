/* eslint-disable no-undef */
const GetThreadCommentByThreadUseCase = require('../GetThreadCommentByThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/thread_comments/ThreadCommentRepository');
const ThreadCommentDetail = require('../../../Domains/thread_comments/entities/ThreadCommentDetail');

describe('GetThreadCommentByThreadUseCase', () => {
  it('should orchestrating the get thread comment by thread action correctly', async () => {
    const threadId = 'thread-123';

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.getThreadCommentsByThreadId = jest.fn().mockImplementation(() => Promise.resolve([
      new ThreadCommentDetail({
        id: 'comment-123',
        username: 'sandy',
        date: new Date('2023-11-14').toISOString(),
        content: 'sebuah comment',
        isDelete: false,
      }),
      new ThreadCommentDetail({
        id: 'comment-123',
        username: 'sandy',
        date: new Date('2023-11-14').toISOString(),
        content: 'sebuah comment',
        isDelete: true,
      }),
    ]));

    const getThreadCommentByThreadUseCase = new GetThreadCommentByThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    const comments = await getThreadCommentByThreadUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadCommentRepository.getThreadCommentsByThreadId).toBeCalledWith(threadId);
    expect(getThreadCommentByThreadUseCase).toBeInstanceOf(GetThreadCommentByThreadUseCase);
    expect(comments).toBeInstanceOf(Array);
    expect(comments).toHaveLength(2);

    const [comment1, comment2] = comments;
    expect(comment1).toStrictEqual(new ThreadCommentDetail({
      id: 'comment-123',
      username: 'sandy',
      date: new Date('2023-11-14').toISOString(),
      content: 'sebuah comment',
      isDelete: false,
    }));
    expect(comment2).toStrictEqual(new ThreadCommentDetail({
      id: 'comment-123',
      username: 'sandy',
      date: new Date('2023-11-14').toISOString(),
      content: 'sebuah comment',
      isDelete: true,
    }));
  });
});
