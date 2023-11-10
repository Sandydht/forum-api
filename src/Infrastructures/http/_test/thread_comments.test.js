/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const createServer = require('../createServer');
const container = require('../../container');

describe('/threads comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await Promise.all([
      AuthenticationsTableTestHelper.cleanTable(),
      UsersTableTestHelper.cleanTable(),
      ThreadsTableTestHelper.cleanTable(),
      ThreadCommentsTableTestHelper.cleanTable(),
    ]);
  });

  describe('when POST /threads comment', () => {
    it('should response 201 and new thread comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah comment',
      };

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
        payload: requestPayload,
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

    it('should response 404 if thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah comment',
      };

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
        url: '/threads/thread-234/comments',
        payload: requestPayload,
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

    it('should response 401 when user not logged in', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah comment',
      };

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
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 if add thread comment payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};

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
        payload: requestPayload,
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

    it('should response 400 if add thread comment payload wrong data type', async () => {
      // Arrange
      const requestPayload = {
        content: 1234,
      };

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
        payload: requestPayload,
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
