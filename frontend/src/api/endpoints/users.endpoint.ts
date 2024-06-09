import { UsersDto } from "api/models/users.model.ts";
import { Http } from "utils/api/http.ts";
import { faker } from "@faker-js/faker";

const generateWorker = (): UsersDto.User => ({
  id: faker.number.int(),
  full_name: faker.person.fullName(),
  work_phone: faker.phone.number(),
  personal_phone: faker.phone.number(),
  sex: faker.helpers.arrayElements(["male", "female"]) as unknown as UsersDto.Gengers,
  role: faker.helpers.arrayElements(["admin", "user"]) as unknown as UsersDto.Roles,
  rank: faker.helpers.arrayElements(["a1", "a2", "a3"]) as unknown as UsersDto.Ranks,
  shift: faker.helpers.arrayElements(["day by day", "2/2", "1n", "2n", "5"]) as unknown as UsersDto.Shifts,
  working_hours: faker.number.int().toString(),
  area: faker.helpers.arrayElements(["CU1", "CU2", "CU3", "CU3(N)", "CU4", "CU4(N)", "CU5", "CU8"]) as unknown as UsersDto.Areas,
  is_lite: faker.datatype.boolean(),
  personnel_number: faker.number.int({ min: 1, max: 10000 }).toString(),
});

export const UsersEndpoint = new (class WorkersEndpoint {
  //find all workers
  findAll = async () => {
    // const res = await Http.request("/users")
    //   .expectJson(z.array(WorkersDto.User))
    //   .get();
    const workers = Array.from({ length: 16 }, generateWorker);
    //wait for 1 second to simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return workers;
  };

  //find worker by id
  findById = async (id: string) => {
    // const res = await Http.request(`/users/${id}`)
    //   .expectJson(UsersDto.User)
    //   .get();
    // return res;
    console.log("findById", id)
    const worker = generateWorker();
    //wait for 1 second to simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return worker;
  };

  //create worker
  create = async (data: UsersDto.UserForm) => {
    const res = await Http.request("/user/signup")
      .expectJson(UsersDto.User)
      .post(data);
    return res;
  };

  //update worker
  update = async (id: string, data: UsersDto.User) => {
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
