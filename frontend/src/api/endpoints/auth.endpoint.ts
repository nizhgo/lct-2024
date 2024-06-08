import { AuthDto } from "api/models/auth.model";
import { Http } from "src/utils/api/http.ts";

export const AuthEndpoint = new (class AuthEndpoint {
  //example of how to use the endpoint
  login = async (data: AuthDto.AuthPayload) => {
    const res = await Http.request("/auth/login")
      .expectJson(AuthDto.AuthPayload)
      .post(data);
    console.log(res);
  };
})();
