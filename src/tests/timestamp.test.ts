import request from "supertest";
import app from "../app";
import moment from "moment";

const port = process.env.PORT;

describe("timestamp", () => {
 jest.setTimeout(10000);

 let server;
 beforeEach(() => {
  server = app.listen(port);
 });

 afterEach(() => {
  server.close();
 });

 describe("success", () => {
  it("should return next block number if timestamp is equal to the block timestamp", async () => {
   const timestamp = 1438334627;
   const res = await request(app).get(`/blocks/${timestamp}`).expect(200);
   expect(res.body.data.nextBlock).toBe(10001);
  });

  it("should return next block number if timestamp is beetween 2 blocks timestamps", async () => {
   const timestamp = 1438334630;
   const res = await request(app).get(`/blocks/${timestamp}`).expect(200);
   expect(res.body.data.nextBlock).toBe(10001);
  });

  it("should return 1 block number for a timestamp which is less than the 1 block timestamp", async () => {
   const timestamp = 123;
   const res = await request(app).get(`/blocks/${timestamp}`).expect(200);
   expect(res.body.data.nextBlock).toBe(1);
  });
 });

 describe("fail", () => {
  it("should return 404 for incorrect url", async () => {
   const timestamp = Math.round(moment.now() / 1000).toString();
   const res = await request(app).get(`/block/${timestamp}`).expect(404);
   expect(res.body).toEqual({});
  });

  it("should return 400 for incorrect timestamp", async () => {
   const timestamp = "1000abc";
   const res = await request(app).get(`/blocks/${timestamp}`).expect(400);
   expect(res.body).toEqual({ errors: ["Timestamp is incorrect"] });
  });

  it("should return 400 for a timestamp which is more than the current timestamp", async () => {
   const timestamp = Math.round(moment.now() / 1000 + 10);
   const res = await request(app).get(`/blocks/${timestamp}`).expect(400);
   expect(res.body).toEqual({
    errors: ["There is no next block number for this timestamp"],
   });
  });

  it("should return 400 for milliseconds sent instead of seconds", async () => {
   const timestamp = Date.now();
   const res = await request(app).get(`/blocks/${timestamp}`).expect(400);
   expect(res.body).toEqual({
    errors: ["Timestamp contains milliseconds instead of seconds"],
   });
  });
 });
});
