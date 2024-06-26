import { UsersDto } from "api/models/users.model.ts";
import { Http } from "utils/api/http.ts";
import { z } from "zod";

export const UsersEndpoint = new (class UsersEndpoint {
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
    return await Http.request("/users/")
      .withSearch(queryParams)
      .expectJson(z.array(UsersDto.User))
      .get();
  };

  //find worker by id
  findById = async (id: string) => {
    const res = await Http.request(`/users/${id}`)
      .expectJson(UsersDto.User)
      .get();
    return res;
  };

  //create worker
  create = async (data: UsersDto.UserForm) => {
    return await Http.request("/users/")
      .expectJson(UsersDto.RegistrationResponse)
      .post(data);
  };

  //update worker
  update = async (id: string, data: UsersDto.UserUpdateForm) => {
    const res = await Http.request(`/users/${id}`)
      .expectJson(UsersDto.User)
      .put(data);
    return res;
  };

  //delete worker
  delete = async (id: string) => {
    const res = await Http.request(`/users/${id}`).delete();
    return res;
  };

  check = async (id: string) => {
    const res = await Http.request(`/users/present/${id}`).patch();
    return res;
  };
})();
