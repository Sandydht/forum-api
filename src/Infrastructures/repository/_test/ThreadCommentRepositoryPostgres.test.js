/* eslint-disable no-undef */
const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const AddThreadComment = require('../../../Domains/thread_comments/entities/AddThreadComment');
const AddedThreadComment = require('../../../Domains/thread_comments/entities/AddedThreadComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadCommentRepositoryPostgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('addThreadComment function', () => {
    it('should persist add thread comment and return added thread comment correctly', async () => {
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
      const comments = await ThreadCommentsTableTestHelper.findThreadCommentById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added thread comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      const addThreadComment = new AddThreadComment({
        content: 'sebuah comment',
      });
      const fakeIdGenerator = () => '123';
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await threadCommentRepositoryPostgres.addThreadComment('user-123', 'thread-123', addThreadComment);

      // Assert
      expect(threadCommentRepositoryPostgres).toBeInstanceOf(ThreadCommentRepositoryPostgres);
      expect(addedComment).toStrictEqual(new AddedThreadComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyAvailableThreadComment function', () => {
    it('should throw NotFoundError when thread comment not available', async () => {
      // Arrange
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadCommentRepositoryPostgres.verifyAvailableThreadComment('comment-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread comment available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadCommentRepositoryPostgres.verifyAvailableThreadComment('comment-123')).resolves.not.toThrowError(NotFoundError);
    });
  });
});
