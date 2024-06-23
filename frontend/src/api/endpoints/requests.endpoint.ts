import { RequestsDto } from "api/models/requests.model.ts";
import { Http } from "utils/api/http.ts";
import { z } from "zod";
export const RequestsEndpoint = new (class RequestsEndpoint {
  findAll = async (offset: number, limit: number, query?: string) => {
    return await Http.request("/requests/")
      .withSearch({ offset, limit, query })
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
      .expectJson(RequestsDto.Request)
      .post(data);
  };

  update = async (id: string, data: RequestsDto.RequestForm) => {
    return await Http.request(`/requests/${id}`)
      .expectJson(RequestsDto.Request)
      .put(data);
  };

  autoDistribute = async (date: Date = new Date()) => {
    return await Http.request("/requests/distibute")
      .expectJson(RequestsDto.Request)
      .post({ current_time: date, distribution_type: "auto" });
  };
})();
