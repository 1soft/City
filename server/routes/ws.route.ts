import { Context, Router } from "../deps.ts";
import WSServer from "../services/socket.service.ts";

const wsRoutes = new Router();
const wsServer = new WSServer();
wsRoutes.get("/ws", (ctx: Context) => wsServer.handleConnection(ctx));

export default wsRoutes;