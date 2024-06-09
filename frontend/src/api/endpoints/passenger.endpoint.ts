import {faker} from "@faker-js/faker";
import {PassengerDto} from "api/models/passenger.model.ts";
import {Http} from "utils/api/http.ts";

const generatePassenger = () => ({
    id: faker.number.int({min: 1, max: 10000}),
    full_name: faker.person.fullName(),
    category: faker.helpers.arrayElements(["CAT1", "CAT2", "CAT3"]),
    description: faker.lorem.sentence(),
    phone: faker.phone.number()
});

export const PassengerEndpoint = new (class PassengerEndpoint {
    //find all passengers
    findAll = async () => {
        const passengers = Array.from({length: 40}, generatePassenger);
        //wait for 1 second to simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        return passengers;
    };

    //find passengers by id
    findById = async (id: string) => {
        console.log("findById", id);
        const passenger = generatePassenger();
        //wait for 1 second to simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        return passenger;
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