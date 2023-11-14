/* eslint-disable no-undef */
const AddThreadCommentReplyUseCase = require('../AddThreadCommentReplyUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/thread_comments/ThreadCommentRepository');
const ThreadCommentReplyRepository = require('../../../Domains/thread_comment_replies/ThreadCommentReplyRepository');
const AddedThreadCommentReply = require('../../../Domains/thread_comment_replies/entities/AddedThreadCommentReply');
const AddThreadCommentReply = require('../../../Domains/thread_comment_replies/entities/AddThreadCommentReply');

describe('AddThreadCommentReplyUseCase', () => {
  it('should orchestrating the add thread comment reply action correctly', async () => {
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const useCasePayload = {
      content: 'sebuah balasan',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadCommentReplyRepository = new ThreadCommentReplyRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.verifyAvailableThreadComment = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentReplyRepository.addThreadCommentReply = jest.fn().mockImplementation(() => Promise.resolve(new AddedThreadCommentReply({
      id: 'reply-123',
      content: 'sebuah balasan',
      owner: 'user-123',
    })));

    const addThreadCommentReplyUseCase = new AddThreadCommentReplyUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      threadCommentReplyRepository: mockThreadCommentReplyRepository,
    });

    // Action
    const addedReply = await addThreadCommentReplyUseCase.execute(userId, threadId, commentId, useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadCommentRepository.verifyAvailableThreadComment).toBeCalledWith(commentId);
    expect(mockThreadCommentReplyRepository.addThreadCommentReply).toBeCalledWith(userId, threadId, commentId, new AddThreadCommentReply({
      content: 'sebuah balasan',
    }));
    expect(addThreadCommentReplyUseCase).toBeInstanceOf(AddThreadCommentReplyUseCase);
    expect(addedReply).toStrictEqual(new AddedThreadCommentReply({
      id: 'reply-123',
      content: 'sebuah balasan',
      owner: 'user-123',
    }));
  });
});
