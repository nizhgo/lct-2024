import { AuthDto } from "api/models/auth.model.ts";
import {setStoredAuthToken} from "utils/api/authToken.ts";

class AuthService {
  constructor() {
    this.auth = { state: "unauthorized" };
  }

  setAuth(data: AuthDto.AuthResponse) {
    this.item = data;
    setStoredAuthToken(data.access_token);
    this.auth = { state: "authorized", ...data };
  }

  auth: { state: "loading" | "authorized" | "unauthorized" };
  item: AuthDto.AuthResponse | null = null;
}

export const authService = new AuthService();
