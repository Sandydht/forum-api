/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const createServer = require('../createServer');
const container = require('../../container');

describe('/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted thread comment', async () => {
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
        url: `/threads/${responseJsonThread.data.addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: {
          authorization: `Bearer ${responseJsonAuthentication.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
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

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseJsonThread.data.addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment',
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when thread not found', async () => {
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

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: {},
        headers: {
          authorization: `Bearer ${responseJsonAuthentication.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });

    it('should response 400 when request payload not contain needed property', async () => {
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
        url: `/threads/${responseJsonThread.data.addedThread.id}/comments`,
        payload: {},
        headers: {
          authorization: `Bearer ${responseJsonAuthentication.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread comment baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type spesification', async () => {
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
        url: `/threads/${responseJsonThread.data.addedThread.id}/comments`,
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
      expect(responseJson.message).toEqual('tidak dapat membuat thread comment baru karena tipe data tidak sesuai');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 when thread comment deleted successfully', async () => {
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
        method: 'DELETE',
        url: `/threads/${responseJsonThread.data.addedThread.id}/comments/${responseJsonThreadComment.data.addedComment.id}`,
        headers: {
          authorization: `Bearer ${responseJsonAuthentication.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
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
        method: 'DELETE',
        url: `/threads/${responseJsonThread.data.addedThread.id}/comments/${responseJsonThreadComment.data.addedComment.id}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 403 when the comment is not the user`s', async () => {
      // Arrange
      const server = await createServer(container);

      await Promise.all([
        server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'test1',
            password: 'secret',
            fullname: 'Test 1',
          },
        }),
        server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'test2',
            password: 'secret',
            fullname: 'Test 2',
          },
        }),
      ]);

      const [responseAuthentication1, responseAuthentication2] = await Promise.all([
        server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'test1',
            password: 'secret',
          },
        }),
        server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'test2',
            password: 'secret',
          },
        }),
      ]);
      const responseJsonAuthentication1 = JSON.parse(responseAuthentication1.payload);
      const responseJsonAuthentication2 = JSON.parse(responseAuthentication2.payload);

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread',
        },
        headers: {
          authorization: `Bearer ${responseJsonAuthentication1.data.accessToken}`,
        },
      });
      const responseJsonThread = JSON.parse(responseThread.payload);

      const [responseThreadComment1] = await Promise.all([
        server.inject({
          method: 'POST',
          url: `/threads/${responseJsonThread.data.addedThread.id}/comments`,
          payload: {
            content: 'sebuah comment',
          },
          headers: {
            authorization: `Bearer ${responseJsonAuthentication1.data.accessToken}`,
          },
        }),
        server.inject({
          method: 'POST',
          url: `/threads/${responseJsonThread.data.addedThread.id}/comments`,
          payload: {
            content: 'sebuah comment',
          },
          headers: {
            authorization: `Bearer ${responseJsonAuthentication2.data.accessToken}`,
          },
        }),
      ]);
      const responseJsonThreadComment1 = JSON.parse(responseThreadComment1.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${responseJsonThread.data.addedThread.id}/comments/${responseJsonThreadComment1.data.addedComment.id}`,
        headers: {
          authorization: `Bearer ${responseJsonAuthentication2.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread comment tidak ditemukan');
    });

    it('should response 404 when thread not found', async () => {
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

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/{threadId}/comments/{commentId}',
        headers: {
          authorization: `Bearer ${responseJsonAuthentication.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });

    it('should response 404 when thread comment not found', async () => {
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
        method: 'DELETE',
        url: `/threads/${responseJsonThread.data.addedThread.id}/comments/{commentId}`,
        headers: {
          authorization: `Bearer ${responseJsonAuthentication.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread comment tidak ditemukan');
    });
  });
});
