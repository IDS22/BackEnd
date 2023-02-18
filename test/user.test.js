const request = require('supertest');
const { app } = require('../server');

describe('User endpoints', () => {
    beforeAll(async () => {
      await User.deleteMany({});
    });
  
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/user')
        .send({ username: 'testuser', password: 'testpassword', mail: 'test@test.com' });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('_id');
      userId = res.body._id;
    });
  
    it('should return an array of users', async () => {
      const res = await request(app)
        .get('/user');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  
    it('should log in a user', async () => {
      const res = await request(app)
        .post('/user/login')
        .send({ username: 'testuser', password: 'testpassword' });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });
  
    it('should delete a user', async () => {
      const res = await request(app)
        .delete(`/user/${userId}`)
        .send({ id: userId });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual('User successfully deleted');
    });
  
    it('should return a 404 if user is not found', async () => {
      const res = await request(app)
        .delete(`/user/${userId}`)
        .send({ id: userId });
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual('User does not exist');
    });
  });