import { AuthDto } from "api/models/auth.model";
import { getStoredAuthToken, removeStoredAuthToken, setStoredAuthToken } from "utils/api/authToken";
import { AuthEndpoint } from "api/endpoints/auth.endpoint";
import { makeAutoObservable } from "mobx";

const AuthService = new (class AuthService {
  private _token: string | null = null;
  private _user: AuthDto.AuthUser | null = null;
  private _isLoading = true;

  constructor() {
    makeAutoObservable(this);
  }

   async init() {
    this._token = getStoredAuthToken();
    if (this._token) {
      try {
        this._user = await AuthEndpoint.findMe();
      } catch (error) {
        console.warn('Error during user initialization:', error);
      }
    }
     console.log("Init is done, user is", this._user || "not logged in");
    this._isLoading = false;
  }

  public setAuth(data: AuthDto.AuthResponse) {
    this._user = data.user;
    this._token = data.access_token;
    setStoredAuthToken(data.access_token);
  }

  public logout() {
    console.log("Logging out");
    removeStoredAuthToken();
    this._user = null;
    this._token = null;
  }

  public get token(): string | null {
    return this._token;
  }

  public get user(): AuthDto.AuthUser | null {
    return this._user;
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }
})();

export default AuthService;