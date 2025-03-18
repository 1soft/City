import { createReducer, on } from "@ngrx/store";
import { loginSuccess, logout } from "./auth.actions";

export interface AuthState {
  token: string | null;
  expiresAt: number | null;
}

export const initialAuthState: AuthState = {
  token: localStorage.getItem("token"),
  expiresAt: Number(localStorage.getItem("expiresAt")) || null,
};

export const authReducer = createReducer(
  initialAuthState,
  on(loginSuccess, (state, { token, expiresAt }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("expiresAt", expiresAt.toString());
    return { token, expiresAt };
  }),
  on(logout, () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAt");
    return { token: null, expiresAt: null };
  })
);
