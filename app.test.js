const request = require('supertest');
const app = require('./app');
const validations = require('./utils/validations');

describe('Test the GET /healthz endpoint', () => {
    it('should return 200 OK', async () => {
      const response = await request(app).get('/healthz');
      expect(response.statusCode).toBe(200);
    });
  });

describe('Test the email validation function', () => {
  it('should return true if valid email is passed to function', () => {

});

 /*

describe("GET /v1/user/:userId", () => {
    it("should have a userId in the request parameters and authorization in header", async () => {
      const userId = "3";
      const username = "kiran@gmail.com";
      const password = "kiran";
      const encodedCredentials = Buffer.from(`${username}:${password}`).toString("base64");
      const res = await request(app).get(`/v1/user/${userId}`)
      .set("Authorization", `Basic ${encodedCredentials}`)
      .expect(200);      
    });
  });
  
describe("POST /v1/user", () => {  
    it("returns 400 Bad Request if username already exists", async () => {
      const user = {
        first_name: "kiran",
        last_name: "reddy",
        username: "kiran@example.com",
        password: "kiran"
      };
  
      await request(app)
        .post("/v1/user")
        .send(user)
        .expect(400);
    });
  });
  
  */
