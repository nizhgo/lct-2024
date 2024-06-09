import { makeAutoObservable } from "mobx";
import { AuthDto } from "api/models/auth.model.ts";
import { authService } from "src/stores/auth.service.ts";

export class LoginPageViewModel {
  constructor() {
    makeAutoObservable(this);
  }

  form: AuthDto.AuthPayload = {
    email: "",
    password: "",
  };

  async onSubmit(): Promise<boolean> {
    console.log("submit");
    const isValidLogin = true; // Тут будет логика проверки логина и пароля

    if (isValidLogin) {
      authService.setAuth({ state: "authorized" });
      return true;
    } else {
      return false;
    }
  }
}
