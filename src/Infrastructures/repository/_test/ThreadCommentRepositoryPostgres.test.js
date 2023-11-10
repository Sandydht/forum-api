/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool');
const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddThreadComment = require('../../../Domains/thread_comments/entities/AddThreadComment');
const AddedThreadComment = require('../../../Domains/thread_comments/entities/AddedThreadComment');

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
});
