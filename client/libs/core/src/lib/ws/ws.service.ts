import { Injectable, inject } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { AuthState } from "../store/auth.reducer";

@Injectable({ providedIn: "root" })
export class WebSocketService {
  private socket!: WebSocket;
  private authState = inject(Store).pipe(select((state: { auth: AuthState }) => state.auth));

  constructor() {
    this.authState.subscribe(auth => {
      if (auth.token) {
        this.connect(auth.token);
      }
    });
  }

  private connect(token: string) {
    this.socket = new WebSocket("ws://localhost:8000");

    this.socket.onopen = () => {
      this.socket.send(JSON.stringify({ token }));
    };

    this.socket.onmessage = (event) => {
      console.log("New Task Update:", event.data);
    };
  }
}
