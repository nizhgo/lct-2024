import { UsersDto } from "api/models/users.model.ts";
import { Http } from "utils/api/http.ts";
import { z } from "zod";

export const UsersEndpoint = new (class UsersEndpoint {
  //find all staff
  findAll = async (offset?: number, limit?: number, search?: string) => {
    const res = await Http.request("/users/")
      .expectJson(z.array(UsersDto.User))
      .withSearch({ offset, limit, search })
      .get();
    return res;
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
    return await Http.request("/users/").post(data);
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
})();
