/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadCommentRepliesTableTestHelper = require('../../../../tests/ThreadCommentRepliesTableTestHelper');
const createServer = require('../createServer');
const container = require('../../container');

describe('/threads comment reply endpoint', () => {
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

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and new thread comment reply', async () => {
      // Arrange
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'sandy',
          password: 'secret',
          fullname: 'Sandy Dwi',
        },
      });

      const responseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'sandy',
          password: 'secret',
        },
      });
      const responseJsonAuthentication = JSON.parse(responseAuthentication.payload);

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread',
        },
        headers: {
          authorization: `Bearer ${responseJsonAuthentication.data.accessToken}`,
        },
      });
      const responseJsonThread = JSON.parse(responseThread.payload);

      const responseThreadComment = await server.inject({
        method: 'POST',
        url: `/threads/${responseJsonThread.data.addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: {
          authorization: `Bearer ${responseJsonAuthentication.data.accessToken}`,
        },
      });
      const responseJsonThreadComment = JSON.parse(responseThreadComment.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseJsonThread.data.addedThread.id}/comments/${responseJsonThreadComment.data.addedComment.id}/replies`,
        payload: {
          content: 'sebuah balasan',
        },
        headers: {
          authorization: `Bearer ${responseJsonAuthentication.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply.id).toBeDefined();
      expect(responseJson.data.addedReply.content).toBeDefined();
      expect(responseJson.data.addedReply.owner).toBeDefined();
    });

    it('should response 401 when user not logged in', async () => {
      // Arrange
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'sandy',
          password: 'secret',
          fullname: 'Sandy Dwi',
        },
      });

      const responseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'sandy',
          password: 'secret',
        },
      });
      const responseJsonAuthentication = JSON.parse(responseAuthentication.payload);

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread',
        },
        headers: {
          authorization: `Bearer ${responseJsonAuthentication.data.accessToken}`,
        },
      });
      const responseJsonThread = JSON.parse(responseThread.payload);

      const responseThreadComment = await server.inject({
        method: 'POST',
        url: `/threads/${responseJsonThread.data.addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: {
          authorization: `Bearer ${responseJsonAuthentication.data.accessToken}`,
        },
      });
      const responseJsonThreadComment = JSON.parse(responseThreadComment.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseJsonThread.data.addedThread.id}/comments/${responseJsonThreadComment.data.addedComment.id}/replies`,
        payload: {
          content: 'sebuah balasan',
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 if thread not found', async () => {
      // Arrange
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'sandy',
          password: 'secret',
          fullname: 'Sandy Dwi',
        },
      });

      const responseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'sandy',
          password: 'secret',
        },
      });
      const responseJsonAuthentication = JSON.parse(responseAuthentication.payload);

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread',
        },
        headers: {
          authorization: `Bearer ${responseJsonAuthentication.data.accessToken}`,
        },
      });
      const responseJsonThread = JSON.parse(responseThread.payload);

      const responseThreadComment = await server.inject({
        method: 'POST',
        url: `/threads/${responseJsonThread.data.addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: {
          authorization: `Bearer ${responseJsonAuthentication.data.accessToken}`,
        },
      });
      const responseJsonThreadComment = JSON.parse(responseThreadComment.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/thread-123/comments/${responseJsonThreadComment.data.addedComment.id}/replies`,
        payload: {
          content: 'sebuah balasan',
        },
        headers: {
          authorization: `Bearer ${responseJsonAuthentication.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 if thread comment not found', async () => {
      // Arrange
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'sandy',
          password: 'secret',
          fullname: 'Sandy Dwi',
        },
      });

      const responseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'sandy',
          password: 'secret',
        },
      });
      const responseJsonAuthentication = JSON.parse(responseAuthentication.payload);

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread',
        },
        headers: {
          authorization: `Bearer ${responseJsonAuthentication.data.accessToken}`,
        },
      });
      const responseJsonThread = JSON.parse(responseThread.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseJsonThread.data.addedThread.id}/comments/comment-123/replies`,
        payload: {
          content: 'sebuah balasan',
        },
        headers: {
          authorization: `Bearer ${responseJsonAuthentication.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Comment tidak ditemukan');
    });

    it('should response 400 if add thread comment reply payload not contain needed property', async () => {
      // Arrange
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'sandy',
          password: 'secret',
          fullname: 'Sandy Dwi',
        },
      });

      const responseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'sandy',
          password: 'secret',
        },
      });
      const responseJsonAuthentication = JSON.parse(responseAuthentication.payload);

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread',
        },
        headers: {
          authorization: `Bearer ${responseJsonAuthentication.data.accessToken}`,
        },
      });
      const responseJsonThread = JSON.parse(responseThread.payload);

      const responseThreadComment = await server.inject({
        method: 'POST',
        url: `/threads/${responseJsonThread.data.addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: {
          authorization: `Bearer ${responseJsonAuthentication.data.accessToken}`,
        },
      });
      const responseJsonThreadComment = JSON.parse(responseThreadComment.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseJsonThread.data.addedThread.id}/comments/${responseJsonThreadComment.data.addedComment.id}/replies`,
        payload: {},
        headers: {
          authorization: `Bearer ${responseJsonAuthentication.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan content');
    });

    it('should response 400 if add thread comment reply payload wrong data type', async () => {
      // Arrange
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'sandy',
          password: 'secret',
          fullname: 'Sandy Dwi',
        },
      });

      const responseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'sandy',
          password: 'secret',
        },
      });
      const responseJsonAuthentication = JSON.parse(responseAuthentication.payload);

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread',
        },
        headers: {
          authorization: `Bearer ${responseJsonAuthentication.data.accessToken}`,
        },
      });
      const responseJsonThread = JSON.parse(responseThread.payload);

      const responseThreadComment = await server.inject({
        method: 'POST',
        url: `/threads/${responseJsonThread.data.addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: {
          authorization: `Bearer ${responseJsonAuthentication.data.accessToken}`,
        },
      });
      const responseJsonThreadComment = JSON.parse(responseThreadComment.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseJsonThread.data.addedThread.id}/comments/${responseJsonThreadComment.data.addedComment.id}/replies`,
        payload: {
          content: 123,
        },
        headers: {
          authorization: `Bearer ${responseJsonAuthentication.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('content harus string');
    });
  });
});
