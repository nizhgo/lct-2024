import { makeAutoObservable } from "mobx";

//TODO: Implement auth service
class AuthService {
  constructor() {
    makeAutoObservable(this);
    this.auth = { state: "unauthorized" };
  }

  setAuth(auth: { state: "loading" | "authorized" | "unauthorized" }) {
    this.auth = auth;
  }

  auth: { state: "loading" | "authorized" | "unauthorized" };
}

export const authService = new AuthService();
