import { AssertionError } from "assert";
import http from "http";
import { parse } from "url";
import { Route } from "./core/routing";
type Request = http.IncomingMessage;
type Response = string;
type ViewFunc = (req: Request) => Response;

export class Typhoon {
  private server: http.Server;
  private routes: Route[] = [];
  private endpoint_to_view_func = new Map<string, ViewFunc>();
  constructor() {
    this.server = http.createServer(this.dispatchRequest.bind(this));
    this.server.on("clientError", this.onClientError.bind(this));
  }

  protected dispatchRequest(req: http.IncomingMessage, resp: http.ServerResponse) {
    const url = parse(req.url!);
    const matchedRoute = this.routes.find(it => it.match(url.pathname!));
    if (matchedRoute) {
      const view_func = this.endpoint_to_view_func.get(matchedRoute.endpoint);
      if (view_func) {
        const body = view_func(req);
        resp.end(body);
        return;
      }
    }
    resp.statusCode = 404;
    resp.end("Not found");
  }

  protected onClientError(err: Error, socket: any) {}

  run(host = "127.0.0.1", port = 5000, debug = true) {
    this.server.listen(port, host);
  }
  stop() {
    this.server.close();
  }

  /**
   *
   * @param rule URL 规则字符串
   * @param endpoint 此 URL规则名称
   * @param view_func 处理请求的函数
   */
  add_url_rute(options: { rule: string; endpoint: string; view_func: ViewFunc }) {
    const { rule, endpoint, view_func } = options;
    const route = new Route({ rule, endpoint });
    this.routes.push(route);
    const old_func = this.endpoint_to_view_func.get(endpoint);
    if (old_func && old_func !== view_func) {
      throw new AssertionError({
        message: `View function mapping is overwriting an existing endpoint function:${endpoint}`,
      });
    }
    this.endpoint_to_view_func.set(endpoint, view_func);
  }
  private fid = 0;
  route(rule: string, view_func: ViewFunc) {
    const endpoint = view_func.name || "view_func" + ++this.fid;
    this.add_url_rute({ rule, endpoint, view_func });
  }
}
