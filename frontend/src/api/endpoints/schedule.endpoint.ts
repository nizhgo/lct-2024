import { ScheduleDto } from "api/models/schedule.model.ts";
import { Http } from "utils/api/http.ts";
import { z } from "zod";

export const ScheduleEndpoint = new (class ScheduleEndpoint {
  findAll = async (start_time: Date, end_time: Date) => {
    return await Http.request("/schedules/")
      .withSearch({
        start_time: start_time.toISOString(),
        end_time: end_time.toISOString(),
      })
      .expectJson(z.array(ScheduleDto.Item))
      .get();
  };

  autoDistribute = async (date: Date = new Date(), type: ScheduleDto.DistributionType) => {
    return await Http.request("/requests/distribute")
      .withSearch({ current_time: date.toISOString(), distribution_type: type })
      .post();
  };
})();
