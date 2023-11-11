/* eslint-disable no-undef */
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const ThreadCommentDetail = require('../../../Domains/thread_comments/entities/ThreadCommentDetail');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/thread_comments/ThreadCommentRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const ThreadCommentReplyRepository = require('../../../Domains/thread_comment_replies/ThreadCommentReplyRepository');
const ThreadCommentReplyDetail = require('../../../Domains/thread_comment_replies/entities/ThreadCommentReplyDetail');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';

    const mockThreadDetail = new ThreadDetail({
      id: threadId,
      title: 'sebuah thread',
      body: 'sebuah body thread',
      createdAt: Math.floor(new Date().getTime() / 1000.0), // epoch unix
      username: 'sandy',
      comments: [],
    });
    const mockThreadCommentDetail = new ThreadCommentDetail({
      id: 'comment-123',
      username: 'sandy',
      createdAt: Math.floor(new Date().getTime() / 1000.0), // epoch unix
      deletedAt: Math.floor(new Date().getTime() / 1000.0), // epoch unix
      content: 'sebuah comment',
      replies: [],
    });
    const mockThreadCommentReplyDetail = new ThreadCommentReplyDetail({
      id: 'reply-123',
      username: 'sandy',
      createdAt: Math.floor(new Date().getTime() / 1000.0), // epoch unix
      deletedAt: Math.floor(new Date().getTime() / 1000.0), // epoch unix
      content: 'sebuah balasan',
    });
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadCommentReplyRepository = new ThreadCommentReplyRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(mockThreadDetail));
    mockThreadCommentRepository.getCommentByThreadId = jest.fn().mockImplementation(() => Promise.resolve([mockThreadCommentDetail]));
    mockThreadCommentReplyRepository.getRepliesByThread = jest.fn().mockImplementation(() => Promise.resolve([mockThreadCommentReplyDetail]));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      threadCommentReplyRepository: mockThreadCommentReplyRepository,
    });

    // Action
    const getThreadDetail = await getThreadDetailUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockThreadCommentRepository.getCommentByThreadId).toBeCalledWith(threadId);

    expect(getThreadDetail.id).toBeDefined();
    expect(getThreadDetail.title).toBeDefined();
    expect(getThreadDetail.body).toBeDefined();
    expect(getThreadDetail.date).toBeDefined();
    expect(getThreadDetail.username).toBeDefined();
    expect(getThreadDetail.comments).toBeDefined();
    expect(Array.isArray(getThreadDetail.comments)).toBeTruthy();

    getThreadDetail.comments.forEach((comment) => {
      expect(comment.id).toBeDefined();
      expect(comment.username).toBeDefined();
      expect(comment.date).toBeDefined();
      expect(comment.replies).toBeDefined();
      expect(Array.isArray(comment.replies)).toBeTruthy();
      expect(comment.content).toBeDefined();
      expect(mockThreadCommentReplyRepository.getRepliesByThread).toBeCalledWith(threadId, comment.id);

      comment.replies.forEach((reply) => {
        expect(reply.id).toBeDefined();
        expect(reply.username).toBeDefined();
        expect(reply.date).toBeDefined();
        expect(reply.content).toBeDefined();
      });
    });
  });
});
