import { makeAutoObservable } from "mobx";
import { AuthDto } from "api/models/auth.model.ts";
import { AuthEndpoint } from "api/endpoints/auth.endpoint.ts";
import AuthService from "src/stores/auth.service.ts";
import { redirect } from "react-router-dom";

export class LoginPageViewModel {
  constructor() {
    makeAutoObservable(this);
  }

  hasError = false;

  async onSubmit(data: AuthDto.AuthForm): Promise<boolean> {
    try {
      const res = await AuthEndpoint.login(data);
      if (res) {
        AuthService.setAuth(res);
        redirect("/");
        return true;
      } else {
        return false;
      }
    } catch (e) {
      this.hasError = true;
      return false;
    }
  }
}
