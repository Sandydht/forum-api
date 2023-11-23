/* eslint-disable no-undef */
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadCommentLikesTableTestHelper = require('../../../../tests/ThreadCommentLikesTableTestHelper');
const ThreadCommentLikeRepositoryPostgres = require('../ThreadCommentLikeRepositoryPostgres');
const pool = require('../../database/postgres/pool');

describe('ThreadCommentLikeRepositoryPostgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadCommentLikesTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
    await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
  });

  describe('addThreadCommentLike function', () => {
    it('should persist add thread comment like and return added thread comment like correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const threadCommentLikeRepositoryPostgres = new ThreadCommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadCommentLikeRepositoryPostgres.addThreadCommentLike('user-123', 'thread-123', 'comment-123');

      // Assert
      const likes = await ThreadCommentLikesTableTestHelper.findThreadCommentLikeById('comment-like-123');
      expect(likes).toHaveLength(1);
    });

    it('should return added thread comment like correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const threadCommentLikeRepositoryPostgres = new ThreadCommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThreadCommentLike = await threadCommentLikeRepositoryPostgres.addThreadCommentLike('user-123', 'thread-123', 'comment-123');

      // Assert
      expect(threadCommentLikeRepositoryPostgres).toBeInstanceOf(ThreadCommentLikeRepositoryPostgres);
      expect(addedThreadCommentLike.id).toEqual('comment-like-123');
      expect(addedThreadCommentLike.thread_id).toEqual('thread-123');
      expect(addedThreadCommentLike.comment_id).toEqual('comment-123');
      expect(addedThreadCommentLike.user_id).toEqual('user-123');
    });
  });

  describe('getIdAvailableThreadCommentLike function', () => {
    it('should return null when like not found', async () => {
      // Arrange
      const threadCommentLikeRepositoryPostgres = new ThreadCommentLikeRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadCommentLikeRepositoryPostgres.getIdAvailableThreadCommentLike('user-123', 'thread-123', 'comment-123')).resolves.toBeNull();
    });

    it('should return like id correctly', async () => {
      // Arrange
      await ThreadCommentLikesTableTestHelper.addThreadCommentLike({
        id: 'comment-like-123', threadId: 'thread-123', commentId: 'comment-123', userId: 'user-123',
      });

      const threadCommentLikeRepositoryPostgres = new ThreadCommentLikeRepositoryPostgres(pool, {});

      // Action
      const likeId = await threadCommentLikeRepositoryPostgres.getIdAvailableThreadCommentLike('user-123', 'thread-123', 'comment-123');

      // Assert
      expect(likeId).toEqual('comment-like-123');
    });
  });

  describe('deleteThreadCommentLike function', () => {
    it('should delete thread comment like from database', async () => {
      // Arrange
      await ThreadCommentLikesTableTestHelper.addThreadCommentLike({
        id: 'comment-like-123', threadId: 'thread-123', commentId: 'comment-123', userId: 'user-123',
      });

      const threadCommentLikeRepositoryPostgres = new ThreadCommentLikeRepositoryPostgres(pool, {});

      // Action
      await threadCommentLikeRepositoryPostgres.deleteThreadCommentLike('comment-like-123');

      // Assert
      const likes = await ThreadCommentLikesTableTestHelper.findThreadCommentLikeById('comment-like-123');
      expect(likes).toHaveLength(0);
    });
  });

  describe('getThreadCommentLikeCountByCommentId function', () => {
    it('should return 0 when like not available', async () => {
      // Arrange
      const threadCommentLikeRepositoryPostgres = new ThreadCommentLikeRepositoryPostgres(pool, {});

      // Action
      const likeCount = await threadCommentLikeRepositoryPostgres.getThreadCommentLikeCountByCommentId('comment-123');

      // Assert
      expect(likeCount).toEqual(0);
    });

    it('should not return 0 when like available', async () => {
      // Arrange
      await ThreadCommentLikesTableTestHelper.addThreadCommentLike({
        id: 'comment-like-123', threadId: 'thread-123', commentId: 'comment-123', userId: 'user-123',
      });

      const threadCommentLikeRepositoryPostgres = new ThreadCommentLikeRepositoryPostgres(pool, {});

      // Action
      const likeCount = await threadCommentLikeRepositoryPostgres.getThreadCommentLikeCountByCommentId('comment-123');

      // Assert
      expect(likeCount).not.toEqual(0);
    });
  });
});
