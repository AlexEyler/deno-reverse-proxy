import { Application } from "https://deno.land/x/oak/mod.ts";

export interface HostOptions {
  hostname?: string;
  port: number;
  proxy: boolean;
}

export class Host {
  hostname?: string;
  port: number;
  public application: Application;

  constructor(options: HostOptions) {
    this.hostname = options.hostname;
    this.port = options.port;
    this.application = new Application({
      proxy: options.proxy,
    });
  }

  start(): Promise<void> {
    console.log(`Listening on ${this.hostname}:${this.port}`);
    return this.application.listen({
      hostname: this.hostname,
      port: this.port,
    });
  }

  addExceptionHandlerMiddleware(): Application<Record<string, any>> {
    return this.application.use(async (ctx, next) => {
      try {
        await next();
      } catch (err) {
        console.log(`An error occurred: ${err}`);
      }
    });
  }
}
