import http from "http";
import { parse } from "url";
export class Typhoon {
  private server: http.Server;
  constructor() {
    this.server = http.createServer(this.dispatchRequest.bind(this));
    this.server.on("clientError", this.onClientError.bind(this));
  }

  protected dispatchRequest(req: http.IncomingMessage, resp: http.ServerResponse) {
    const url = parse(req.url!);
    if (url.pathname === "/") {
      resp.end("It works!");
    } else {
      resp.statusCode = 404;
      resp.end("Not found");
    }
  }

  protected onClientError(err: Error, socket: any) {}

  run(host = "127.0.0.1", port = 5000, debug = true) {
    this.server.listen(port, host);
  }
  stop() {
    this.server.close();
  }
}
