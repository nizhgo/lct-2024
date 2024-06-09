//TODO: Implement auth service
import { AuthDto } from "api/models/auth.model.ts";

class AuthService {
  constructor() {
    this.auth = { state: "unauthorized" };
  }

  setAuth(data: AuthDto.AuthResponse) {
    this.item = data;
    this.auth = { state: "authorized", ...data };
  }

  auth: { state: "loading" | "authorized" | "unauthorized" };
  item: AuthDto.AuthResponse | null = null;
}

export const authService = new AuthService();
