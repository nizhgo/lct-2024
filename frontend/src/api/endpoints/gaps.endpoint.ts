import { Http } from "utils/api/http.ts";
import { GapsDto } from "api/models/gaps.model.ts";
import { z } from "zod";

export const GapEndpoint = new (class GapEndpoint {
//find all gaps
  findAll = async (offset?: number, limit?: number, search?: string) => {
    const res = await Http.request("/gaps/")
      .expectJson(z.array(GapsDto.Gap))
      .withSearch({ offset, limit, search })
      .get();
    return res;
  };

  //find gap by id
  findByUser = async (id: string) => {
    const res = await Http.request(`/gaps/${id}`)
      .expectJson(z.array(GapsDto.Gap))
      .get();
    return res;
  };

  //create gap
  create = async (data: GapsDto.GapForm) => {
    return await Http.request("/gaps/").post(data);
  };

  //update gap
  update = async (id: string, data: GapsDto.GapForm) => {
    const res = await Http.request(`/gaps/${id}`)
      .expectJson(GapsDto.Gap)
      .put(data);
    return res;
  };

  //delete gap
  delete = async (id: string) => {
    const res = await Http.request(`/gaps/${id}`).delete();
    return res;
  };
})();