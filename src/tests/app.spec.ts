import request from "supertest";
import { Typhoon } from "../app";
const client = request("http://127.0.0.1:5000");
const app = new Typhoon();
beforeAll(() => {
  app.run();
});
afterAll(() => {
  app.stop();
});

app.route("/status", () => {
  return "It works!";
});

app.route("/", () => {
  return "Welcome to Typhoon!";
});

test("test_status_page_return_it_works", done => {
  client.get("/status").expect(200, "It works!", done);
});
test("test_home_page_return_greeting", done => {
  client.get("/").expect(200, "Welcome to Typhoon!", done);
});
test("test_404_page", done => {
  client.get("/404").expect(404, "Not found", done);
});
