import {AuthDto} from "api/models/auth.model";
import {Http} from "src/utils/api/http.ts";

export const AuthEndpoint = new (class AuthEndpoint {
  login = async (data: AuthDto.AuthForm) => {
    return await Http.request("/users/signin")
        .expectJson(AuthDto.AuthResponse)
        .post(data);
  };

  res = async () => {
    const res = await Http.request("/auth/еуые")
      .expectJson(AuthDto.AuthForm)
      .withSearch({ key: "value", key2: "value2", key3: "value3" })
      .post();
    return res;
  };
})();
