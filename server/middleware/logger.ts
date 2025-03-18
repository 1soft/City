import { Context } from "../deps.ts";

export async function loggerMiddleware(ctx: Context, next) {
  console.log(`🌍 [${ctx.request.method}] ${ctx.request.url}`);
  console.log("Headers:", ...ctx.request.headers);

  try {
    // const bodyText = await ctx.request.body.body({ type: "text" }).value;
    // console.log("Body Text:", bodyText);
  } catch (err) {
    console.error("❌ Failed to read body:", err);
  }

  await next();
};
