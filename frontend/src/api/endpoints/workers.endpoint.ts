import { WorkersDto } from "api/models/workers.mode.ts";
import { Http } from "utils/api/http.ts";
import { faker } from "@faker-js/faker";

export const WorkersEndpoint = new (class WorkersEndpoint {
  //find all workers
  findAll = async () => {
    // const res = await Http.request("/workers")
    //   .expectJson(z.array(WorkersDto.Wroker))
    //   .get();
    const generateWorker = () => ({
      id: faker.number.int(),
      name: faker.person.firstName(),
      middleName: faker.person.middleName(),
      lastName: faker.person.lastName(),
      gender: faker.helpers.arrayElements(["male", "female"]),
      personalPhone: faker.phone.number("+7 (###) ###-##-##"),
      workPhone: faker.phone.number("+7 (###) ###-##-##"),
      tabNumber: faker.datatype.string(10),
      birthDate: faker.date.past(30, new Date(2000, 0, 1)),
      position: faker.person.jobTitle(),
      shift: faker.helpers.arrayElement(["day by day", "2/2", "1n", "2n", "5"]),
      area: faker.person.jobArea(),
      isLightWork: faker.datatype.boolean(),
    });

    const workers = Array.from({ length: 16 }, generateWorker);
    //wait for 1 second to simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return workers;
  };

  //find worker by id
  findById = async (id: string) => {
    const res = await Http.request(`/workers/${id}`)
      .expectJson(WorkersDto.Wroker)
      .get();
    return res;
  };

  //create worker
  create = async (data: WorkersDto.Worker) => {
    const res = await Http.request("/workers")
      .expectJson(WorkersDto.Wroker)
      .post(data);
    return res;
  };

  //update worker
  update = async (id: string, data: WorkersDto.Worker) => {
    const res = await Http.request(`/workers/${id}`)
      .expectJson(WorkersDto.Wroker)
      .put(data);
    return res;
  };

  //delete worker
  delete = async (id: string) => {
    const res = await Http.request(`/workers/${id}`).delete();
    return res;
  };
})();
