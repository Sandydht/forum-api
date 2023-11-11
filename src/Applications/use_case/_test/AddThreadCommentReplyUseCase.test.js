/* eslint-disable no-undef */
const AddThreadCommentReplyUseCase = require('../AddThreadCommentReplyUseCase');
const AddThreadCommentReply = require('../../../Domains/thread_comment_replies/entities/AddThreadCommentReply');
const AddedThreadCommentReply = require('../../../Domains/thread_comment_replies/entities/AddedThreadCommentReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/thread_comments/ThreadCommentRepository');
const ThreadCommentReplyRepository = require('../../../Domains/thread_comment_replies/ThreadCommentReplyRepository');

describe('AddThreadCommentReplyUseCase', () => {
  it('should orchestrating the add thread comment reply action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const useCasePayload = {
      content: 'sebuah balasan',
    };

    // Mock
    const mockAddThreadCommentReply = new AddThreadCommentReply({
      content: useCasePayload.content,
    });
    const mockAddedThreadCommentReply = new AddedThreadCommentReply({
      id: 'reply-123',
      content: 'sebuah balasan',
      userId,
    });
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadCommentReplyRepository = new ThreadCommentReplyRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.verifyAvailableThreadComment = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentReplyRepository.addThreadCommentReply = jest.fn().mockImplementation(() => Promise.resolve(mockAddedThreadCommentReply));

    const addThreadCommentReplyUseCase = new AddThreadCommentReplyUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      threadCommentReplyRepository: mockThreadCommentReplyRepository,
    });

    // Action
    const addedThreadCommentReply = await addThreadCommentReplyUseCase.execute(userId, threadId, commentId, mockAddThreadCommentReply);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadCommentRepository.verifyAvailableThreadComment).toBeCalledWith(commentId);
    expect(addedThreadCommentReply).toStrictEqual(new AddedThreadCommentReply({
      id: 'reply-123',
      content: useCasePayload.content,
      userId,
    }));
  });
});
