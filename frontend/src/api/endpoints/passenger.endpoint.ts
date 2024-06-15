import { PassengerDto } from "api/models/passenger.model.ts";
import { Http } from "utils/api/http.ts";
import { z } from "zod";

export const PassengerEndpoint = new (class PassengerEndpoint {
  //find all passengers
  findAll = async (offset: number, limit: number, search?: string) => {
    return await Http.request("/passengers/")
      .withSearch({ offset, limit, search })
      .expectJson(z.array(PassengerDto.Passenger))
      .get();
  };

  //find passengers by id
  findById = async (id: string) => {
    const res = await Http.request(`/passengers/${id}`)
      .expectJson(PassengerDto.Passenger)
      .get();
    return res;
  };

  //create passengers
  create = async (data: PassengerDto.PassengerForm) => {
    const res = await Http.request("/passengers/")
      .expectJson(PassengerDto.Passenger)
      .post(data);
    return res;
  };

  //update passengers
  update = async (id: string, data: PassengerDto.PassengerForm) => {
    const res = await Http.request(`/passengers/${id}`)
      .expectJson(PassengerDto.Passenger)
      .put(data);
    return res;
  };

  //delete passengers
  delete = async (id: string) => {
    const res = await Http.request(`/passengers/${id}`)
      .expectJson(PassengerDto.Passenger)
      .delete();
    return res;
  };
})();
