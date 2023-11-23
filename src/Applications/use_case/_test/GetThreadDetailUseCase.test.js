/* eslint-disable no-undef */
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/thread_comments/ThreadCommentRepository');
const ThreadCommentReplyRepository = require('../../../Domains/thread_comment_replies/ThreadCommentReplyRepository');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const ThreadCommentDetail = require('../../../Domains/thread_comments/entities/ThreadCommentDetail');
const ThreadCommentReplyDetail = require('../../../Domains/thread_comment_replies/entities/ThreadCommentReplyDetail');
const ThreadCommentLikeRepository = require('../../../Domains/thread_comment_likes/ThreadCommentLikeRepository');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';

    const mockThreadDetail = new ThreadDetail({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date('2023-10-14T00:00:00.000Z'),
      username: 'sandy',
    });
    const mockThreadCommentDetail1 = new ThreadCommentDetail({
      id: 'comment-123',
      username: 'sandy',
      date: new Date('2023-10-14'),
      content: 'sebuah comment',
      isDelete: false,
    });
    const mockThreadCommentDetail2 = new ThreadCommentDetail({
      id: 'comment-234',
      username: 'sandy',
      date: new Date('2023-10-14'),
      content: 'sebuah comment',
      isDelete: true,
    });
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadCommentReplyRepository = new ThreadCommentReplyRepository();
    const mockThreadCommentLikeRepository = new ThreadCommentLikeRepository();

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      created_at: new Date('2023-10-14'),
      username: 'sandy',
    }));
    mockThreadCommentRepository.getThreadCommentsByThreadId = jest.fn(() => Promise.resolve([
      {
        id: 'comment-123',
        username: 'sandy',
        created_at: new Date('2023-10-14'),
        content: 'sebuah comment',
        is_delete: false,
      },
      {
        id: 'comment-234',
        username: 'sandy',
        created_at: new Date('2023-10-14'),
        content: 'sebuah comment',
        is_delete: true,
      },
    ]));
    mockThreadCommentReplyRepository.getThreadCommentRepliesByCommentId = jest.fn(() => Promise.resolve([
      {
        id: 'reply-123',
        username: 'sandy',
        created_at: new Date('2023-10-14'),
        content: 'sebuah balasan',
        is_delete: false,
      },
      {
        id: 'reply-234',
        username: 'sandy',
        created_at: new Date('2023-10-14'),
        content: 'sebuah balasan',
        is_delete: true,
      },
    ]));
    mockThreadCommentLikeRepository.getThreadCommentLikeCountByCommentId = jest.fn(() => Promise.resolve(0));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      threadCommentReplyRepository: mockThreadCommentReplyRepository,
      threadCommentLikeRepository: mockThreadCommentLikeRepository,
    });

    // Action
    const thread = await getThreadDetailUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockThreadCommentRepository.getThreadCommentsByThreadId).toBeCalledWith(threadId);
    expect(getThreadDetailUseCase).toBeInstanceOf(GetThreadDetailUseCase);

    expect(thread.id).toEqual(mockThreadDetail.id);
    expect(thread.title).toEqual(mockThreadDetail.title);
    expect(thread.body).toEqual(mockThreadDetail.body);
    expect(thread.date).toEqual(mockThreadDetail.date);
    expect(thread.username).toEqual(mockThreadDetail.username);

    expect(thread.comments).toBeInstanceOf(Array);
    const [comment1, comment2] = thread.comments;

    expect(comment1.id).toEqual(mockThreadCommentDetail1.id);
    expect(comment1.username).toEqual(mockThreadCommentDetail1.username);
    expect(comment1.date).toEqual(mockThreadCommentDetail1.date);
    expect(comment1.content).toEqual(mockThreadCommentDetail1.content);
    expect(comment1.likeCount).toEqual(0);
    expect(mockThreadCommentReplyRepository.getThreadCommentRepliesByCommentId).toBeCalledWith(comment1.id);
    expect(mockThreadCommentLikeRepository.getThreadCommentLikeCountByCommentId).toBeCalledWith(comment1.id);

    expect(comment1.replies).toBeInstanceOf(Array);
    const [comment1Reply1, comment1Reply2] = comment1.replies;
    expect(comment1Reply1).toStrictEqual(new ThreadCommentReplyDetail({
      id: 'reply-123',
      username: 'sandy',
      date: new Date('2023-10-14'),
      content: 'sebuah balasan',
      isDelete: false,
    }));
    expect(comment1Reply2).toStrictEqual(new ThreadCommentReplyDetail({
      id: 'reply-234',
      username: 'sandy',
      date: new Date('2023-10-14'),
      content: 'sebuah balasan',
      isDelete: true,
    }));

    expect(comment2.id).toEqual(mockThreadCommentDetail2.id);
    expect(comment2.username).toEqual(mockThreadCommentDetail2.username);
    expect(comment2.date).toEqual(mockThreadCommentDetail2.date);
    expect(comment2.content).toEqual(mockThreadCommentDetail2.content);
    expect(comment2.likeCount).toEqual(0);
    expect(mockThreadCommentReplyRepository.getThreadCommentRepliesByCommentId).toBeCalledWith(comment2.id);
    expect(mockThreadCommentLikeRepository.getThreadCommentLikeCountByCommentId).toBeCalledWith(comment2.id);

    expect(comment2.replies).toBeInstanceOf(Array);
    const [comment2Reply1, comment2Reply2] = comment2.replies;
    expect(comment2Reply1).toStrictEqual(new ThreadCommentReplyDetail({
      id: 'reply-123',
      username: 'sandy',
      date: new Date('2023-10-14'),
      content: 'sebuah balasan',
      isDelete: false,
    }));
    expect(comment2Reply2).toStrictEqual(new ThreadCommentReplyDetail({
      id: 'reply-234',
      username: 'sandy',
      date: new Date('2023-10-14'),
      content: 'sebuah balasan',
      isDelete: true,
    }));
  });
});
