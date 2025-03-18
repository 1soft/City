import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import { TaskUpdateEvent, WebSocketWithUsername } from "../models/socket.model.ts";
import { verifyToken } from "./auth.service.ts";

export default class WSServer {
  private connectedClients = new Map<string, WebSocketWithUsername>();

  public async handleConnection(ctx: RouterContext) {
    const socket: WebSocketWithUsername = await ctx.upgrade();
    const url = new URL(ctx.request.url);
    const token = url.searchParams.get("token");

    if (!token) {
      socket.close(1008, "No authentication token provided");
      return;
    }

    const email = await this.getUserEmail(socket, token);
    socket.email = email;

    if (this.connectedClients.has(email)) {
      socket.close(1008, `User ${email} is already connected`);
      return;
    }

    this.connectedClients.set(email, socket);

    socket.onopen = () => {
      console.log(`User connected: ${email}`);
      this.broadcastUsers();
    };

    socket.onclose = () => {
      this.clientDisconnected(email);
    };

    socket.onmessage = async (event: MessageEvent) => {
      try {
        const { token, data } = JSON.parse(event.data);
        const user = await verifyToken(token);
    
        if (!user) {
          socket.close();
          return;
        }
    
        this.connectedClients.set(user.email, socket);
    
        const payload: TaskUpdateEvent = { ...data, email: user.email };
    
        // Broadcast the message to all clients except the sender
        this.broadcast(payload, user.email);
      } catch (error) {
        console.error("WebSocket Error:", error);
      }
    };    
  }

  private clientDisconnected(email: string) {
    this.connectedClients.delete(email);
    this.broadcastUsers();
    console.log(`User disconnected: ${email}`);
  }

  private broadcastUsers() {
    const users = [...this.connectedClients.keys()];
    this.broadcast({ type: "update-users", users } as TaskUpdateEvent);
  }

  private broadcast(message: TaskUpdateEvent, senderEmail?: string) {
    const messageString = JSON.stringify(message);
    for (const [email, client] of this.connectedClients.entries()) {
      if (email !== senderEmail) {
        client.send(messageString);
      }
    }
  }
  

  private async getUserEmail(socket: WebSocketWithUsername, token: string) {
    const user = await verifyToken(token);
    if (!user) {
      socket.close(1008, "Invalid token");
      return;
    }

    return user.email;
  }
}