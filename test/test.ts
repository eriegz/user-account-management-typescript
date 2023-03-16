const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../dist/app');
const cacheService = require('../dist/services/cacheService')

const CONFIG = require('../dist/config');

const redis = cacheService.redisConnection;
const expressApp = app.app;
const httpServer = app.httpServer;
const httpsServer = app.httpsServer;

chai.use(chaiHttp);
const expect = chai.expect;

describe('Test the REST API user CRUD endpoints and authentication', () => {
  // User 1, "Alice":
  const aliceUsername: string = 'alice';
  const alicePassword: string = 'P@ssword123!';
  let aliceCreatedUsername: string;
  let aliceJwtToken: string;
  // User 2, "Bob":
  const bobUsername: string = 'bob';
  const bobPassword: string = 'P@ssword123!';
  let bobCreatedUsername: string;
  // Shared:
  const newPassword = 'newPaSSWORD!123';

  // Below: We want to test the cache expiry functionality, meaning we have to wait enough time
  // after the previous GET request for the cached value to expire:
  const testWithCacheExpiryDelay = 'Read user (GET), cache expiring';

  before(async () => {
    await mongoose.connection.dropDatabase();
  });

  beforeEach(function (done) {
    if (this.currentTest.title === testWithCacheExpiryDelay) {
      setTimeout(done, (CONFIG.REDIS_KEY_EXPIRE_TIME_SECONDS * 1000) + 1000);
    } else {
      done();
    }
  });

  after(() => {
    mongoose.connection.close();
    redis.quit();
    httpServer.close();
    httpsServer.close();
  });

  it('Create user (POST)', async () => {
    const res = await chai
      .request(expressApp)
      .post('/api/user/register')
      .send({
        username: aliceUsername,
        password: alicePassword,
      });
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('username').to.equal(aliceUsername);
    aliceCreatedUsername = res.body.username;
  });

  // Next, because the remaining 3 endpoints are all secured, we will need to login first:

  it('Login', async () => {
    const res = await chai
      .request(expressApp)
      .post('/api/auth/login')
      .send({
        username: aliceUsername,
        password: alicePassword,
      });
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('username').to.equal(aliceUsername);
    aliceJwtToken = res.header['set-cookie'][0].split(';')[0].split('=')[1];
  });

  it('Read user (GET)', async () => {
    const res = await chai
      .request(expressApp)
      .get(`/api/user/${aliceCreatedUsername}`)
      .set('Cookie', `token=${aliceJwtToken}`);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('username').to.equal(aliceUsername);
  });

  it('Read user (GET), cached response', async () => {
    const res = await chai
      .request(expressApp)
      .get(`/api/user/${aliceCreatedUsername}`)
      .set('Cookie', `token=${aliceJwtToken}`);
    expect(res).to.have.status(304);
    expect(res.body).to.be.empty;
  });

  // Note: There is an appropriate delay before executing this test so that we can verify cache
  // expiry functionality is working:
  it(testWithCacheExpiryDelay, async () => {
    const res = await chai
      .request(expressApp)
      .get(`/api/user/${aliceCreatedUsername}`)
      .set('Cookie', `token=${aliceJwtToken}`);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('username').to.equal(aliceUsername);
  });

  it('Update user (PUT)', async () => {
    const res = await chai
      .request(expressApp)
      .put(`/api/user/${aliceCreatedUsername}`)
      .set('Cookie', `token=${aliceJwtToken}`)
      .send({ password: newPassword });
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('username').to.equal(aliceUsername);
  });

  it('Delete user (DELETE)', async () => {
    const res = await chai
      .request(expressApp)
      .delete(`/api/user/${aliceCreatedUsername}`)
      .set('Cookie', `token=${aliceJwtToken}`);
    expect(res).to.have.status(204);
  });

  it('Invalid create user request', async () => {
    const res = await chai
      .request(expressApp)
      .post('/api/user/register')
      .send({
        username: aliceUsername,
        // Missing 'password' field
      });
    expect(res).to.have.status(400);
    expect(res.body).to.have.property('error');
  });

  it('Invalid read user request (no JWT token)', async () => {
    const res = await chai
      .request(expressApp)
      .get(`/api/user/${aliceCreatedUsername}`);
    expect(res).to.have.status(401);
    expect(res.body).to.have.property('error');
  });

  it('Invalid read user request (no user found)', async () => {
    const res = await chai
      .request(expressApp)
      .get(`/api/user/${aliceCreatedUsername}`)
      .set('Cookie', `token=${aliceJwtToken}`);
    expect(res).to.have.status(404);
    expect(res.body).to.have.property('error');
  });

  it('Create another user (POST)', async () => {
    const res = await chai
      .request(expressApp)
      .post('/api/user/register')
      .send({
        username: bobUsername,
        password: bobPassword,
      });
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('username').to.equal(bobUsername);
    bobCreatedUsername = res.body.username;
  });

  it('Test authorization failure (Alice trying to delete Bob\'s account)', async () => {
    const res = await chai
      .request(expressApp)
      .delete(`/api/user/${bobCreatedUsername}`)
      .set('Cookie', `token=${aliceJwtToken}`);
    expect(res).to.have.status(401);
  });

});
