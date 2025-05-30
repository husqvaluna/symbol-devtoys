export namespace Route {
  export interface ClientActionArgs {
    request: Request;
  }

  export interface LoaderArgs {
    request: Request;
    params: Record<string, string>;
  }

  export type ActionArgs = ClientActionArgs;
}
