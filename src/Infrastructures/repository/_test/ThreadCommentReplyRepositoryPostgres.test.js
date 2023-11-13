/* eslint-disable no-undef */
const ThreadCommentReplyRepositoryPostgres = require('../ThreadCommentReplyRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadCommentRepliesTableTestHelper = require('../../../../tests/ThreadCommentRepliesTableTestHelper');
const AddThreadCommentReply = require('../../../Domains/thread_comment_replies/entities/AddThreadCommentReply');
const AddedThreadCommentReply = require('../../../Domains/thread_comment_replies/entities/AddedThreadCommentReply');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadCommentReplyRepositoryPostgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadCommentRepliesTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('addThreadCommentReply function', () => {
    it('should persist add thread comment reply and return added thread comment reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      const addThreadCommentReply = new AddThreadCommentReply({
        content: 'sebuah balasan',
      });
      const fakeIdGenerator = () => '123';
      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadCommentReplyRepositoryPostgres.addThreadCommentReply('user-123', 'thread-123', 'comment-123', addThreadCommentReply);

      // Assert
      const replies = await ThreadCommentRepliesTableTestHelper.findThreadCommentReplyById('reply-123');
      expect(replies).toHaveLength(1);
    });

    it('should return added thread comment reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      const addThreadCommentReply = new AddThreadCommentReply({
        content: 'sebuah balasan',
      });
      const fakeIdGenerator = () => '123';
      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await threadCommentReplyRepositoryPostgres.addThreadCommentReply('user-123', 'thread-123', 'comment-123', addThreadCommentReply);

      // Assert
      expect(threadCommentReplyRepositoryPostgres).toBeInstanceOf(ThreadCommentReplyRepositoryPostgres);
      expect(addedReply).toStrictEqual(new AddedThreadCommentReply({
        id: 'reply-123',
        content: 'sebuah balasan',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyAvailableThreadCommentReplyByUser function', () => {
    it('should throw AuthorizationError when thread comment reply not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadCommentReplyRepositoryPostgres.verifyAvailableThreadCommentReplyByUser('user-123', 'reply-123')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when thread comment reply available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      await ThreadCommentRepliesTableTestHelper.addThreadCommentReply({
        id: 'reply-123', threadId: 'thread-123', commentId: 'comment-123', userId: 'user-123',
      });
      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadCommentReplyRepositoryPostgres.verifyAvailableThreadCommentReplyByUser('user-123', 'reply-123')).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('verifyAvailableThreadCommentReply function', () => {
    it('should throw NotFoundError when thread comment reply not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadCommentReplyRepositoryPostgres.verifyAvailableThreadCommentReply('reply-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread comment reply available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      await ThreadCommentRepliesTableTestHelper.addThreadCommentReply({
        id: 'reply-123', threadId: 'thread-123', commentId: 'comment-123', userId: 'user-123',
      });
      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadCommentReplyRepositoryPostgres.verifyAvailableThreadCommentReply('reply-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('deleteThreadCommentReply function', () => {
    it('should update thread comment reply', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      await ThreadCommentRepliesTableTestHelper.addThreadCommentReply({
        id: 'reply-123', threadId: 'thread-123', commentId: 'comment-123', userId: 'user-123',
      });
      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, {});

      // Action
      await threadCommentReplyRepositoryPostgres.deleteThreadCommentReply('reply-123');

      // Assert
      const replies = await ThreadCommentRepliesTableTestHelper.findThreadCommentReplyById('reply-123');
      expect(replies).toHaveLength(1);
      expect(replies[0].deleted_at).not.toBeNull();
    });
  });
});
