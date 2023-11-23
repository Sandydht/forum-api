/* eslint-disable no-undef */
const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ThreadCommentRepositoryPostgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
  });

  describe('addThreadComment function', () => {
    it('should persist add thread comment and return added thread comment correctly', async () => {
      // Arrange
      const payload = {
        content: 'sebuah comment',
      };

      const fakeIdGenerator = () => '123';
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadCommentRepositoryPostgres.addThreadComment('user-123', 'thread-123', payload);

      // Assert
      const comments = await ThreadCommentsTableTestHelper.findThreadCommentById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added thread comment correctly', async () => {
      // Arrange
      const payload = {
        content: 'sebuah comment',
      };

      const fakeIdGenerator = () => '123';
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await threadCommentRepositoryPostgres.addThreadComment('user-123', 'thread-123', payload);

      // Assert
      expect(threadCommentRepositoryPostgres).toBeInstanceOf(ThreadCommentRepositoryPostgres);
      expect(addedComment.id).toEqual('comment-123');
      expect(addedComment.content).toEqual(payload.content);
      expect(addedComment.user_id).toEqual('user-123');
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
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadCommentRepositoryPostgres.verifyAvailableThreadComment('comment-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyAvailableThreadCommentByUser function', () => {
    it('should throw AuthorizationError when thread comment not available', async () => {
      // Arrange
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadCommentRepositoryPostgres.verifyAvailableThreadCommentByUser('user-123', 'comment-123')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when thread comment available', async () => {
      // Arrange
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', userId: 'user-123', threadId: 'thread-123' });
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadCommentRepositoryPostgres.verifyAvailableThreadCommentByUser('user-123', 'comment-123')).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteThreadComment function', () => {
    it('should update thread comment', async () => {
      // Arrange
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action
      await threadCommentRepositoryPostgres.deleteThreadComment('comment-123');

      // Assert
      const comments = await ThreadCommentsTableTestHelper.findThreadCommentById('comment-123');
      expect(comments).toHaveLength(1);
      expect(comments[0].is_delete).toEqual(true);
    });
  });

  describe('getThreadCommentsByThreadId function', () => {
    it('should return empty array when comments not found', async () => {
      // Arrange
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action
      const comments = await threadCommentRepositoryPostgres.getThreadCommentsByThreadId('thread-123');

      // Assert
      expect(comments).toBeInstanceOf(Array);
      expect(comments).toHaveLength(0);
    });

    it('should return comments correctly', async () => {
      // Arrange
      await ThreadCommentsTableTestHelper.addThreadComment({
        id: 'comment-123',
        threadId: 'thread-123',
        userId: 'user-123',
        createdAt: new Date('2023-11-14T13:00:00.000Z'),
        content: 'sebuah comment',
        isDelete: false,
      });
      await ThreadCommentsTableTestHelper.addThreadComment({
        id: 'comment-234',
        threadId: 'thread-123',
        userId: 'user-123',
        createdAt: new Date('2023-11-14T12:00:00.000Z'),
        content: 'sebuah comment',
        isDelete: true,
      });
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action
      const comments = await threadCommentRepositoryPostgres.getThreadCommentsByThreadId('thread-123');

      // Assert
      expect(comments).toBeInstanceOf(Array);
      expect(comments).toHaveLength(2);

      const [comment1, comment2] = comments;
      expect(comment1.id).toEqual('comment-234');
      expect(comment1.username).toEqual('sandy');
      expect(new Date(comment1.created_at).toISOString()).toEqual(new Date('2023-11-14T12:00:00.000Z').toISOString());
      expect(comment1.content).toEqual('sebuah comment');
      expect(comment1.is_delete).toEqual(true);

      expect(comment2.id).toEqual('comment-123');
      expect(comment2.username).toEqual('sandy');
      expect(new Date(comment2.created_at).toISOString()).toEqual(new Date('2023-11-14T13:00:00.000Z').toISOString());
      expect(comment2.content).toEqual('sebuah comment');
      expect(comment2.is_delete).toEqual(false);
    });
  });
});
