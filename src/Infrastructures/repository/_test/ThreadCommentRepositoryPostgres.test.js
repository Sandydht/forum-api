/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool');
const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddThreadComment = require('../../../Domains/thread_comments/entities/AddThreadComment');
const AddedThreadComment = require('../../../Domains/thread_comments/entities/AddedThreadComment');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadCommentRepositoryPostgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await Promise.all([
      UsersTableTestHelper.cleanTable(),
      ThreadsTableTestHelper.cleanTable(),
      ThreadCommentsTableTestHelper.cleanTable(),
    ]);
  });

  describe('addThreadComment function', () => {
    it('should persist add thread comment and return data correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      const addThreadComment = new AddThreadComment({
        content: 'sebuah comment',
      });
      const fakeIdGenerator = () => '123';
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadCommentRepositoryPostgres.addThreadComment('user-123', 'thread-123', addThreadComment);

      // Assert
      const threadComments = await ThreadCommentsTableTestHelper.findThreadCommentById('comment-123');
      expect(threadComments).toHaveLength(1);
    });

    it('should return thread comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      const addThreadComment = new AddThreadComment({
        content: 'sebuah comment',
      });
      const fakeIdGenerator = () => '123';
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThreadComment = await threadCommentRepositoryPostgres.addThreadComment('user-123', 'thread-123', addThreadComment);

      // Assert
      expect(addedThreadComment).toStrictEqual(new AddedThreadComment({
        id: 'comment-123',
        content: addThreadComment.content,
        owner: 'user-123',
      }));
    });
  });

  describe('verifyThreadCommentByUser function', () => {
    it('should throw AuthorizationError when thread comment not found', async () => {
      // Arrange
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadCommentRepositoryPostgres.verifyThreadCommentByUser('user-123', 'comment-123')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when thread comment available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({ threadId: 'thread-123', userId: 'user-123' });
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadCommentRepositoryPostgres.verifyThreadCommentByUser('user-123', 'comment-123')).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('verifyAvailableThreadComment function', () => {
    it('should throw NotFoundError when thread comment not found', async () => {
      // Arrange
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadCommentRepositoryPostgres.verifyAvailableThreadComment('comment-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread comment available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadCommentRepositoryPostgres.verifyAvailableThreadComment('comment-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('deleteThreadComment function', () => {
    it('should soft delete comment in the database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action
      await threadCommentRepositoryPostgres.deleteThreadComment('comment-123');

      // Assert
      const comments = await ThreadCommentsTableTestHelper.findThreadCommentById('comment-123');
      expect(comments[0].deleted_at).not.toEqual(null);
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should return empty array when thread comment not found', async () => {
      // Arrange
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action
      const comments = await threadCommentRepositoryPostgres.getCommentByThreadId('thread-123');

      // Assert
      expect(comments).toHaveLength(0);
    });

    it('should return thread comment list correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'sandy' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });

      const threadCommenRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action
      const comments = await threadCommenRepositoryPostgres.getCommentByThreadId('thread-123');

      // Assert
      expect(comments).toHaveLength(1);
    });
  });
});
