import { makeAutoObservable } from "mobx";
import {AuthDto } from "api/models/auth.model.ts";
import { authService } from "src/stores/auth.service.ts";
import {AuthEndpoint} from "api/endpoints/auth.endpoint.ts";

export class LoginPageViewModel {
  constructor() {
    makeAutoObservable(this);
  }

  hasError = false;

  async onSubmit(data: AuthDto.AuthForm): Promise<boolean> {
    try {
      const res = await AuthEndpoint.login(data);
      if (res) {
        authService.setAuth(res);
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
