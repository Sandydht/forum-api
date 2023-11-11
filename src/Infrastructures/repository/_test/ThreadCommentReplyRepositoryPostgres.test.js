/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadCommentRepliesTableTestHelper = require('../../../../tests/ThreadCommentRepliesTableTestHelper');
const AddThreadCommentReply = require('../../../Domains/thread_comment_replies/entities/AddThreadCommentReply');
const AddedThreadCommentReply = require('../../../Domains/thread_comment_replies/entities/AddedThreadCommentReply');
const ThreadCommentReplyRepositoryPostgres = require('../ThreadCommentReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ThreadCommentReplyRepositoryPostgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadCommentRepliesTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('addThreadCommentReply function', () => {
    it('should persist add thread comment reply and return correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      const addThreadCommentReply = new AddThreadCommentReply({ content: 'sebuah balasan' });
      const fakeIdGenerator = () => '123';
      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadCommentReplyRepositoryPostgres.addThreadCommentReply('user-123', 'thread-123', 'comment-123', addThreadCommentReply);

      // Assert
      const threadCommentReplies = await ThreadCommentRepliesTableTestHelper.findThreadCommentReplyById('reply-123');
      expect(threadCommentReplies).toHaveLength(1);
    });

    it('should return thread comment reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      const addThreadCommentReply = new AddThreadCommentReply({ content: 'sebuah balasan' });
      const fakeIdGenerator = () => '123';
      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThreadCommentReply = await threadCommentReplyRepositoryPostgres.addThreadCommentReply('user-123', 'thread-123', 'comment-123', addThreadCommentReply);

      // Assert
      expect(addedThreadCommentReply).toStrictEqual(new AddedThreadCommentReply({
        id: 'reply-123',
        content: 'sebuah balasan',
        userId: 'user-123',
      }));
    });
  });

  describe('getRepliesByThread function', () => {
    it('should return empty array when thread comment has no replies', async () => {
      // Arrange
      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await threadCommentReplyRepositoryPostgres.getRepliesByThread('thread-123', 'comment-123');

      // Assert
      expect(Array.isArray(replies)).toBeTruthy();
      expect(replies).toHaveLength(0);
    });

    it('should return thread comment replies list correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'sandy' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      await ThreadCommentRepliesTableTestHelper.addThreadCommentReply({
        id: 'reply-123', threadId: 'thread-123', commentId: 'comment-123', userId: 'user-123',
      });
      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await threadCommentReplyRepositoryPostgres.getRepliesByThread('thread-123', 'comment-123');

      // Assert
      expect(Array.isArray(replies)).toBeTruthy();

      replies.forEach((reply) => {
        expect(reply.id).toBeDefined();
        expect(reply.username).toBeDefined();
        expect(reply.date).toBeDefined();
        expect(reply.content).toBeDefined();
      });
    });
  });

  describe('verifyAvalilableThreadCommentReply function', () => {
    it('should throw NotFoundError when thread comment reply not found', async () => {
      // Arrange
      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadCommentReplyRepositoryPostgres.verifyAvalilableThreadCommentReply('reply-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread comment reply available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      await ThreadCommentRepliesTableTestHelper.addThreadCommentReply({
        id: 'reply-123', threadId: 'thread-123', commentId: 'comment-123', userId: 'user-123',
      });
      const threadCommentRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadCommentRepositoryPostgres.verifyAvalilableThreadCommentReply('reply-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyAvalilableThreadCommentReplyByUser function', () => {
    it('should throw AuthorizationError when thread comment reply not found', async () => {
      // Arrange
      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadCommentReplyRepositoryPostgres.verifyAvalilableThreadCommentReplyByUser('user-123', 'reply-123')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when thread comment reply available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      await ThreadCommentRepliesTableTestHelper.addThreadCommentReply({
        id: 'reply-123', threadId: 'thread-123', commentId: 'comment-123', userId: 'user-123',
      });
      const threadCommentRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadCommentRepositoryPostgres.verifyAvalilableThreadCommentReplyByUser('user-123', 'reply-123')).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteThreadCommentReply function', () => {
    it('should soft delete thread comment reply in the database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      await ThreadCommentRepliesTableTestHelper.addThreadCommentReply({
        id: 'reply-123', threadId: 'thread-123', commentId: 'comment-123', userId: 'user-123',
      });
      const threadCommentRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, {});

      // Action
      await threadCommentRepositoryPostgres.deleteThreadCommentReply('reply-123');

      // Assert
      const replies = await ThreadCommentRepliesTableTestHelper.findThreadCommentReplyById('reply-123');
      expect(replies[0].deleted_at).not.toEqual(null);
    });
  });
});
