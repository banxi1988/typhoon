export class Route {
  readonly rule: string;
  readonly endpoint: string;
  constructor(options: { rule: string; endpoint: string }) {
    this.rule = options.rule;
    this.endpoint = options.endpoint;
  }

  match(path: string): boolean {
    return this.rule === path;
  }
}
