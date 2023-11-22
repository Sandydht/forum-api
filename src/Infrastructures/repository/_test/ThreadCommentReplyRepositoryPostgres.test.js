/* eslint-disable no-undef */
const ThreadCommentReplyRepositoryPostgres = require('../ThreadCommentReplyRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadCommentRepliesTableTestHelper = require('../../../../tests/ThreadCommentRepliesTableTestHelper');
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
      const payload = {
        content: 'sebuah balasan',
      };

      const fakeIdGenerator = () => '123';
      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadCommentReplyRepositoryPostgres.addThreadCommentReply('user-123', 'thread-123', 'comment-123', payload);

      // Assert
      const replies = await ThreadCommentRepliesTableTestHelper.findThreadCommentReplyById('reply-123');
      expect(replies).toHaveLength(1);
    });

    it('should return added thread comment reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      const payload = {
        content: 'sebuah balasan',
      };

      const fakeIdGenerator = () => '123';
      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await threadCommentReplyRepositoryPostgres.addThreadCommentReply('user-123', 'thread-123', 'comment-123', payload);

      // Assert
      expect(threadCommentReplyRepositoryPostgres).toBeInstanceOf(ThreadCommentReplyRepositoryPostgres);
      expect(addedReply.id).toEqual('reply-123');
      expect(addedReply.content).toEqual(payload.content);
      expect(addedReply.user_id).toEqual('user-123');
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
      expect(replies[0].is_delete).toEqual(true);
    });
  });

  describe('getThreadCommentRepliesByCommentId function', () => {
    it('should return empty array when replies not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'sandy' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await threadCommentReplyRepositoryPostgres.getThreadCommentRepliesByCommentId('comment-123');

      // Assert
      expect(replies).toBeInstanceOf(Array);
      expect(replies).toHaveLength(0);
    });

    it('should return replies correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'sandy' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      await ThreadCommentRepliesTableTestHelper.addThreadCommentReply({
        id: 'reply-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        userId: 'user-123',
        createdAt: new Date('2023-11-14T13:00:00.000Z'),
      });
      await ThreadCommentRepliesTableTestHelper.addThreadCommentReply({
        id: 'reply-234',
        threadId: 'thread-123',
        commentId: 'comment-123',
        userId: 'user-123',
        createdAt: new Date('2023-11-14T12:00:00.000Z'),
      });
      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, {});

      // Delete reply
      await ThreadCommentRepliesTableTestHelper.softDeleteThreadCommentReplyById('reply-234');

      // Action
      const replies = await threadCommentReplyRepositoryPostgres.getThreadCommentRepliesByCommentId('comment-123');

      // Assert
      expect(replies).toBeInstanceOf(Array);
      expect(replies).toHaveLength(2);

      const [reply1, reply2] = replies;
      expect(reply1.id).toEqual('reply-234');
      expect(reply1.username).toEqual('sandy');
      expect(reply1.date).toEqual(new Date('2023-11-14T12:00:00.000Z').toISOString());
      expect(reply1.content).toEqual('**balasan telah dihapus**');

      expect(reply2.id).toEqual('reply-123');
      expect(reply2.username).toEqual('sandy');
      expect(reply2.date).toEqual(new Date('2023-11-14T13:00:00.000Z').toISOString());
      expect(reply2.content).toEqual('sebuah balasan');
    });
  });
});
