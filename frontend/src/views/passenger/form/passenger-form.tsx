import { PageHeader } from "components/pageHeader.tsx";
import { Stack } from "components/stack.ts";

export const PassengerForm = () => {
  return (
    <Stack direction={"column"} gap={6}>
      <PageHeader>Создание пассажира</PageHeader>
    </Stack>
  );
};
