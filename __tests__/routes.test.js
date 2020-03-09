//routes.test.js
const request = require('supertest');
const server = require('../app.js');

beforeAll(async () => {
 // do something before anything else runs
 console.log('Jest starting!');
});

// close the server after each test
afterAll(() => {
 server.close();
 console.log('server closed!');
});

describe('basic route tests', () => {
 test('get home route GET /', async () => {
 const response = await request(server).get('/');

 expect(response.status).toEqual(200);

 expect(response.text).toContain('Hello from Koa\'s ctx.body!');
// next test will pass regardless that it doesn't contain the trailing chars
 expect(response.text).toContain('Hello from Koa');
 // this test will fail because it is the wrong string
//  expect(response.text).toContain('Hello World');
 });
});