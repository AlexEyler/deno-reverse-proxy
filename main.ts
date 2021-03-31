import { Host } from "./utils/host.ts";

console.log(Deno.env.toObject());
const host: Host = new Host({
  proxy: true,
  port: parseInt(Deno.env.get("PORT") || "8081"),
  hostname: Deno.env.get("HOSTNAME") || "0.0.0.0",
});
host
  .addExceptionHandlerMiddleware()
  .use(async (ctx) => {
    const body = ctx.request.body({
      type: "reader",
    });
    const url = "http://0.0.0.0:8080/";
    const contents = await Deno.readAll(body.value);
    const backendResponse = await fetch(url, {
      method: ctx.request.method,
      headers: ctx.request.headers,
      body: contents,
    });
    if (backendResponse.body != null) {
      const responseBody = await backendResponse.body.getReader().read();
      console.log(`Got response: ${responseBody.value}`);
      ctx.response.body = responseBody.value;
      ctx.response.headers = backendResponse.headers;
      ctx.response.status = backendResponse.status;
    }
  });

await host.start();
