import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ZodSchema } from "zod";
import { getStoredAuthToken, removeStoredAuthToken } from "./authToken";

axios.defaults.baseURL = "https://papuas.tech/api/v1";

class HttpRequest<T> {
  readonly #path: string;
  readonly #config?: AxiosRequestConfig<unknown>;
  #schema?: ZodSchema<T>;
  #queryParams?: Record<string, string>;

  constructor(path: string, config?: AxiosRequestConfig<unknown>) {
    this.#path = path;
    this.#config = config;
  }

  public expectJson<U>(schema: ZodSchema<U>): HttpRequest<U> {
    const newRequest = new HttpRequest<U>(this.#path, this.#config);
    newRequest.#schema = schema;
    newRequest.#queryParams = this.#queryParams;
    return newRequest;
  }

  public withSearch(queryParams: Record<string, string>) {
    this.#queryParams = queryParams;
    return this;
  }

  public async get(): Promise<T> {
    try {
      const response: AxiosResponse = await axios.get(this.#path, {
        params: this.#queryParams,
        headers: {
          ...this.getAuthHeaders(),
        },
        ...this.#config,
      });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async post(variables?: unknown): Promise<T> {
    try {
      const response: AxiosResponse = await axios.post(this.#path, variables, {
        headers: {
          ...this.getAuthHeaders(),
          ...this.#config?.headers,
        },
        ...this.#config,
      });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async put(variables?: unknown): Promise<T> {
    try {
      const response: AxiosResponse = await axios.put(this.#path, variables, {
        headers: {
          ...this.getAuthHeaders(),
        },
        ...this.#config,
      });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async delete(): Promise<T> {
    try {
      const response: AxiosResponse = await axios.delete(this.#path, {
        headers: {
          ...this.getAuthHeaders(),
        },
        ...this.#config,
      });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  private getAuthHeaders() {
    return {
      Authorization: getStoredAuthToken()
        ? `Bearer ${getStoredAuthToken()}`
        : undefined,
      "Access-Control-Allow-Origin": "*",
    };
  }

  private handleResponse(response: AxiosResponse): T {
    if (this.#schema) {
      return this.#schema.parse(response.data);
    }
    return response.data;
  }

  private handleError(error: unknown): Promise<never> {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        removeStoredAuthToken();
        if (window?.location) {
          window.location.replace("/login");
        }
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
}

export class Http {
  static request(path: string, config?: AxiosRequestConfig<unknown>) {
    return new HttpRequest<unknown>(path, config);
  }
}
