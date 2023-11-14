/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const createServer = require('../createServer');
const container = require('../../container');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
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
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread',
        },
        headers: {
          authorization: `Bearer ${responseJsonAuthentication.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toBeDefined();
      expect(responseJson.data.addedThread.owner).toBeDefined();
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

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread',
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
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

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
        },
        headers: {
          authorization: `Bearer ${responseJsonAuthentication.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
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

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 123,
        },
        headers: {
          authorization: `Bearer ${responseJsonAuthentication.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should reponse 200 when thread available', async () => {
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
        method: 'GET',
        url: `/threads/${responseJsonThread.data.addedThread.id}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toEqual(responseJsonThread.data.addedThread.id);
      expect(responseJson.data.thread.title).toEqual('sebuah thread');
      expect(responseJson.data.thread.body).toEqual('sebuah body thread');
      expect(typeof responseJson.data.thread.date).toEqual('string');
      expect(responseJson.data.thread.username).toEqual('sandy');
      expect(responseJson.data.thread.comments).toBeInstanceOf(Array);
      expect(responseJson.data.thread.comments).toHaveLength(0);
    });

    it('should response 200 when thread available but comments is not empty', async () => {
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

      const responseThreadComment1 = await server.inject({
        method: 'POST',
        url: `/threads/${responseJsonThread.data.addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment 1',
        },
        headers: {
          authorization: `Bearer ${responseJsonAuthentication.data.accessToken}`,
        },
      });
      const responseThreadComment2 = await server.inject({
        method: 'POST',
        url: `/threads/${responseJsonThread.data.addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment 2',
        },
        headers: {
          authorization: `Bearer ${responseJsonAuthentication.data.accessToken}`,
        },
      });
      const responseJsonThreadComment1 = JSON.parse(responseThreadComment1.payload);
      const responseJsonThreadComment2 = JSON.parse(responseThreadComment2.payload);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${responseJsonThread.data.addedThread.id}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toEqual(responseJsonThread.data.addedThread.id);
      expect(responseJson.data.thread.title).toEqual('sebuah thread');
      expect(responseJson.data.thread.body).toEqual('sebuah body thread');
      expect(typeof responseJson.data.thread.date).toEqual('string');
      expect(responseJson.data.thread.username).toEqual('sandy');
      expect(responseJson.data.thread.comments).toBeInstanceOf(Array);
      expect(responseJson.data.thread.comments).toHaveLength(2);
      console.log('responseJson.data.thread.comments: ', responseJson.data.thread.comments);

      // const [comment1, comment2] = responseJson.data.thread.comments;
      // console.log('comment1: ', comment1);
      // console.log('comment2: ', comment2);
      // expect(comment1.id).toEqual(responseJsonThreadComment2.data.addedComment.id);
      // expect(comment1.username).toEqual('sandy');
      // expect(typeof comment1.date).toEqual('string');
      // expect(comment1.content).toEqual('sebuah comment 2');

      // expect(comment2.id).toEqual(responseJsonThreadComment1.data.addedComment.id);
      // expect(comment2.username).toEqual('sandy');
      // expect(typeof comment2.date).toEqual('string');
      // expect(comment2.content).toEqual('sebuah comment 1');
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/{threadId}',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });
  });
});
