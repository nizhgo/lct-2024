import { AuthDto } from "api/models/auth.model";
import { Http } from "src/utils/api/http.ts";

export const AuthEndpoint = new (class AuthEndpoint {
  login = async (data: AuthDto.AuthForm) => {
    return await Http.request("/users/signin")
      .expectJson(AuthDto.AuthResponse)
      .post(data);
  };

  findMe = async () => {
    return await Http.request("/users/me")
      .expectJson(AuthDto.AuthUser)
      .silent()
      .get();
  };
})();
