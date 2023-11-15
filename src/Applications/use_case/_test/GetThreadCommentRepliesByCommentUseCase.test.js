/* eslint-disable no-undef */
const GetThreadCommentRepliesByCommentUseCase = require('../GetThreadCommentRepliesCommentUseCase');
const ThreadCommentRepository = require('../../../Domains/thread_comments/ThreadCommentRepository');
const ThreadCommentReplyRepository = require('../../../Domains/thread_comment_replies/ThreadCommentReplyRepository');
const ThreadCommentReplyDetail = require('../../../Domains/thread_comment_replies/entities/ThreadCommentReplyDetail');

describe('GetThreadCommentRepliesByCommentUseCase', () => {
  it('should orchestrating the get thread comment replies action correctly', async () => {
    const commentId = 'comment-123';

    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadCommentReplyRepository = new ThreadCommentReplyRepository();

    mockThreadCommentRepository.verifyAvailableThreadComment = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentReplyRepository.getThreadCommentRepliesByCommentId = jest.fn().mockImplementation(() => Promise.resolve([
      new ThreadCommentReplyDetail({
        id: 'reply-123',
        username: 'sandy',
        date: new Date('2023-10-14'),
        content: 'sebuah balasan',
        isDelete: true,
      }),
      new ThreadCommentReplyDetail({
        id: 'reply-234',
        username: 'sandy',
        date: new Date('2023-10-14'),
        content: 'sebuah balasan',
        isDelete: false,
      }),
    ]));

    const getThreadCommentReplyByCommentUseCase = new GetThreadCommentRepliesByCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      threadCommentReplyRepository: mockThreadCommentReplyRepository,
    });

    // Action
    const replies = await getThreadCommentReplyByCommentUseCase.execute(commentId);

    // Assert
    expect(mockThreadCommentRepository.verifyAvailableThreadComment).toBeCalledWith(commentId);
    expect(mockThreadCommentReplyRepository.getThreadCommentRepliesByCommentId).toBeCalledWith(commentId);
    expect(getThreadCommentReplyByCommentUseCase).toBeInstanceOf(GetThreadCommentRepliesByCommentUseCase);

    const [reply1, reply2] = replies;
    expect(reply1).toStrictEqual(new ThreadCommentReplyDetail({
      id: 'reply-123',
      username: 'sandy',
      date: new Date('2023-10-14'),
      content: 'sebuah balasan',
      isDelete: true,
    }));
    expect(reply2).toStrictEqual(new ThreadCommentReplyDetail({
      id: 'reply-234',
      username: 'sandy',
      date: new Date('2023-10-14'),
      content: 'sebuah balasan',
      isDelete: false,
    }));
  });
});
