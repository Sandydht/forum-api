/* eslint-disable no-undef */
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/thread_comments/ThreadCommentRepository');
const ThreadCommentReplyRepository = require('../../../Domains/thread_comment_replies/ThreadCommentReplyRepository');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const ThreadCommentDetail = require('../../../Domains/thread_comments/entities/ThreadCommentDetail');
const ThreadCommentReplyDetail = require('../../../Domains/thread_comment_replies/entities/ThreadCommentReplyDetail');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    // const threadId = 'thread-123';

    // const mockThreadRepository = new ThreadRepository();
    // const mockThreadCommentRepository = new ThreadCommentRepository();
    // const mockThreadCommentReplyRepository = new ThreadCommentReplyRepository();

    // mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(new ThreadDetail({
    //   id: 'thread-123',
    //   title: 'sebuah thread',
    //   body: 'sebuah body thread',
    //   date: new Date('2023-10-14'),
    //   username: 'sandy',
    //   comments: [],
    // })));
    // mockThreadCommentRepository.getThreadCommentsByThreadId = jest.fn().mockImplementation(() => Promise.resolve([
    //   new ThreadCommentDetail({
    //     id: 'comment-123',
    //     username: 'sandy',
    //     date: new Date('2023-10-15'),
    //     content: 'sebuah comment',
    //     isDelete: false,
    //     replies: [],
    //   }),
    //   new ThreadCommentDetail({
    //     id: 'comment-234',
    //     username: 'sandy',
    //     date: new Date('2023-10-14'),
    //     content: 'sebuah comment',
    //     isDelete: true,
    //     replies: [],
    //   }),
    // ]));
    // mockThreadCommentReplyRepository.getThreadCommentRepliesByCommentId = jest.fn().mockImplementation(() => Promise.resolve([
    //   new ThreadCommentReplyDetail({
    //     id: 'reply-123',
    //     username: 'sandy',
    //     date: new Date('2023-10-15'),
    //     content: 'sebuah balasan',
    //     isDelete: false,
    //   }),
    //   new ThreadCommentReplyDetail({
    //     id: 'reply-234',
    //     username: 'sandy',
    //     date: new Date('2023-10-14'),
    //     content: 'sebuah balasan',
    //     isDelete: true,
    //   }),
    // ]));

    // const getThreadDetailUseCase = new GetThreadDetailUseCase({
    //   threadRepository: mockThreadRepository,
    //   threadCommentRepository: mockThreadCommentRepository,
    //   threadCommentReplyRepository: mockThreadCommentReplyRepository,
    // });

    // // Action
    // const thread = await getThreadDetailUseCase.execute(threadId);

    // // Assert
    // expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    // expect(mockThreadCommentRepository.getThreadCommentsByThreadId).toBeCalledWith(threadId);
    // expect(mockThreadCommentReplyRepository.getThreadCommentRepliesByCommentId).toBeCalledWith('comment-123');
    // expect(mockThreadCommentReplyRepository.getThreadCommentRepliesByCommentId).toBeCalledWith('comment-234');
    // expect(getThreadDetailUseCase).toBeInstanceOf(GetThreadDetailUseCase);
    // expect(thread).toStrictEqual(new ThreadDetail({
    //   id: 'thread-123',
    //   title: 'sebuah thread',
    //   body: 'sebuah body thread',
    //   date: new Date('2023-10-14'),
    //   username: 'sandy',
    //   comments: [
    //     new ThreadCommentDetail({
    //       id: 'comment-123',
    //       username: 'sandy',
    //       date: new Date('2023-10-15'),
    //       content: 'sebuah comment',
    //       isDelete: false,
    //       replies: [
    //         new ThreadCommentReplyDetail({
    //           id: 'reply-123',
    //           username: 'sandy',
    //           date: new Date('2023-10-15'),
    //           content: 'sebuah balasan',
    //           isDelete: false,
    //         }),
    //         new ThreadCommentReplyDetail({
    //           id: 'reply-234',
    //           username: 'sandy',
    //           date: new Date('2023-10-14'),
    //           content: 'sebuah balasan',
    //           isDelete: true,
    //         }),
    //       ],
    //     }),
    //     new ThreadCommentDetail({
    //       id: 'comment-234',
    //       username: 'sandy',
    //       date: new Date('2023-10-14'),
    //       content: 'sebuah comment',
    //       isDelete: true,
    //       replies: [
    //         new ThreadCommentReplyDetail({
    //           id: 'reply-123',
    //           username: 'sandy',
    //           date: new Date('2023-10-15'),
    //           content: 'sebuah balasan',
    //           isDelete: false,
    //         }),
    //         new ThreadCommentReplyDetail({
    //           id: 'reply-234',
    //           username: 'sandy',
    //           date: new Date('2023-10-14'),
    //           content: 'sebuah balasan',
    //           isDelete: true,
    //         }),
    //       ],
    //     }),
    //   ],
    // }));
  });
});
