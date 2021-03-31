import { Host } from "./utils/host.ts";
import { Status } from "https://deno.land/x/oak/mod.ts";

const host: Host = new Host({
  proxy: true,
  port: parseInt(Deno.env.get("PORT") || "8080"),
  hostname: Deno.env.get("HOSTNAME") || "0.0.0.0",
});
host
  .addExceptionHandlerMiddleware()
  .use(async (ctx) => {
    console.log(`Received request: ${ctx.request.url}`);
    if (ctx.request.hasBody) {
      const body = ctx.request.body({
        type: "reader",
      });

      const bodyContents = await Deno.readAll(body.value);
      ctx.response.body = bodyContents;
      console.log(`Got body: ${bodyContents}`);
    }

    ctx.response.status = Status.OK;
  });

await host.start();
