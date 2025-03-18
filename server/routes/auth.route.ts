import { Context, Router } from "../deps.ts";
import { authMiddleware } from "../middleware/auth.middlware.ts";
import { register, login } from "../services/auth.service.ts";

const router = new Router({ prefix: "/api/auth" });
const validatBody = async (ctx: Context) => {
  if (!ctx.request.hasBody) {
    ctx.response.status = 400;
    ctx.response.body = { message: "Request body is missing" };
    return false;
  }

  const { email, password } = await ctx.request.body.json()

  if (!email || !password) {
    ctx.response.status = 400;
    ctx.response.body = { message: "email and password are required" };
    return false;
  }
  
  return ctx;

}
router.post("/register", async (ctx: Context) => {
  try {
    await validatBody(ctx);
    const {email, password} = await ctx.request.body.json();

    ctx.response.status = 201;
    ctx.response.body = await register(email, password);
  } catch (error) {
    console.error("❌ Register Error:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Internal Server Error" };
  }
});

router.post("/login", async (ctx: Context) => {
  try {
    await validatBody(ctx);
    const {email, password} = await ctx.request.body.json();
    ctx.response.body = await login(email, password);
  } catch (error) {
    console.error("❌ Login Error:", error);
    ctx.response.status = 401;
    ctx.response.body = { message: error.message || "Invalid credentials" };
  }
});

router.get("/verify", authMiddleware, async (ctx: Context) => {
  ctx.response.body = { success: true, user: ctx.state.user };
});

export default router;
