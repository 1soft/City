import { Application } from "./deps.ts";
import authRoutes from "./routes/auth.route.ts";
import tasksRoutes from "./routes/tasks.route.ts";
import { corsMiddleware } from "./middleware/cors.ts";
import { loggerMiddleware } from "./middleware/logger.ts";
import wsRoutes from "./routes/ws.route.ts";

const PORT = parseInt(Deno.env.get("PORT") || "8000");

let serverRunning = false;

async function startServer() {
  if (serverRunning) {
    console.log("⚠️ Server is already running. Skipping startup.");
    return;
  }

  try {
    console.log(`🚀 Starting server on http://localhost:${PORT}`);
    serverRunning = true;

    const app = new Application();
    app.use(corsMiddleware);
    app.use(loggerMiddleware);
    app.use(authRoutes.routes());
    app.use(authRoutes.allowedMethods());
    app.use(tasksRoutes.routes());
    app.use(tasksRoutes.allowedMethods());
    app.use(wsRoutes.routes());
    app.use(wsRoutes.allowedMethods());

    const listener = await app.listen({ port: PORT, hostname: "0.0.0.0" });

    console.log(`✅ Server is listening on http://localhost:${PORT}`);

  } catch (error) {
    serverRunning = false; // Reset flag if server fails

    if (error instanceof Deno.errors.AddrInUse) {
      console.error(`❌ Port ${PORT} is already in use!`);
      console.error(`🛠️ Check if another process is running and restart the server.`);
      Deno.exit(1);
    } else {
      console.error(`❌ Unexpected server error:`, error);
      Deno.exit(1);
    }
  }
}

// Graceful shutdown on exit signals
Deno.addSignalListener("SIGINT", () => {
  console.log("\n🛑 Server shutting down...");
  serverRunning = false;
  Deno.exit();
});

Deno.addSignalListener("SIGTERM", () => {
  console.log("\n🛑 Server shutting down...");
  serverRunning = false;
  Deno.exit();
});

// Start the server
await startServer();
