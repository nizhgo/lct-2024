import { StationsDto } from "api/models/stations.models.ts";
import { Http } from "utils/api/http.ts";
import { z } from "zod";

export const StationsEndpoint = new (class StationsEndpoint {
  findAll = async (offset: number, limit: number, search?: string) => {
    return await Http.request("/stations/")
      .withSearch({ offset, limit, search })
      .expectJson(z.array(StationsDto.Station))
      .get();
  };
})();
