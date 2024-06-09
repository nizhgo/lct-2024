import { Stack } from "components/stack.ts";
import { PageHeader } from "components/pageHeader.tsx";

const RequestFormPage = () => {
  return (
    <Stack direction={"column"} gap={6}>
      <Stack direction={"row"} justify={"space-between"} align={"center"}>
        <PageHeader>Создание заявки</PageHeader>
      </Stack>
    </Stack>
  );
};

export default RequestFormPage;
