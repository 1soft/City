import { Context } from "../deps.ts";
import { verifyToken } from "../services/auth.service.ts";

export async function authMiddleware(ctx: Context, next: () => Promise<void>) {
  const headers = ctx.request.headers;
  const authHeader = headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Unauthorized" };
    return;
  }

  const token = authHeader.split(" ")[1];
  const payload = await verifyToken(token);

  if (!payload) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Invalid or expired token" };
    return;
  }

  ctx.state.user = payload;
  await next();
}
