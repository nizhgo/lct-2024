import { PassengerDto } from "api/models/passenger.model.ts";
import { Http } from "utils/api/http.ts";
import { z } from "zod";

export const PassengerEndpoint = new (class PassengerEndpoint {
  //find all passengers
  findAll = async () => {
    // const passengers = Array.from({length: 40}, generatePassenger);
    // //wait for 1 second to simulate network delay
    // await new Promise((resolve) => setTimeout(resolve, 500));
    // return passengers;
    return await Http.request("/passengers/")
      .expectJson(z.array(PassengerDto.Passenger))
      .get();
  };

  //find passengers by id
  findById = async (id: string) => {
    console.log("findById", id);
    //wait for 1 second to simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return null;
  };

  //create passengers
  create = async (data: PassengerDto.PassengerForm) => {
    const res = await Http.request("/passengers/signup")
      .expectJson(PassengerDto.Passenger)
      .post(data);
    return res;
  };

  //update passengers
  update = async (id: string, data: PassengerDto.PassengerForm) => {
    const res = await Http.request(`/passenger/${id}`)
      .expectJson(PassengerDto.Passenger)
      .put(data);
    return res;
  };

  //delete passengers
  delete = async (id: string) => {
    const res = await Http.request(`/passenger/${id}`)
      .expectJson(PassengerDto.Passenger)
      .delete();
    return res;
  };
})();
