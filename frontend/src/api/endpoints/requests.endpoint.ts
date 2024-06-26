import { RequestsDto } from "api/models/requests.model.ts";
import { Http } from "utils/api/http.ts";
import { z } from "zod";
export const RequestsEndpoint = new (class RequestsEndpoint {
  findAll = async (
    offset: number,
    limit: number,
    search?: string,
    filters?: Record<string, string>,
  ) => {
    const queryParams: Record<string, string | number> = { offset, limit };
    if (search) {
      queryParams.search = search;
    }
    if (filters) {
      Object.assign(queryParams, filters);
    }
    return await Http.request("/requests/")
      .withSearch(queryParams)
      .expectJson(z.array(RequestsDto.Request))
      .get();
  };

  findById = async (id: string) => {
    const res = await Http.request(`/requests/${id}`)
      .expectJson(RequestsDto.Request)
      .get();
    return res;
  };

  findByPassengerId = async (id: string) => {
    const res = await Http.request(`/requests/passenger/${id}`)
      .expectJson(z.array(RequestsDto.Request))
      .get();
    return res;
  };

  create = async (data: RequestsDto.RequestForm) => {
    return await Http.request("/requests/")
      .post(data);
  };

  update = async (id: string, data: RequestsDto.RequestForm) => {
    return await Http.request(`/requests/${id}`)
      .expectJson(RequestsDto.Request)
      .put(data);
  };
})();
