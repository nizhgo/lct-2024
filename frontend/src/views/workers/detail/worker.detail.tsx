import { useParams } from "react-router-dom";
import { Stack } from "components/stack.ts";
import { PageHeader } from "components/pageHeader.tsx";

export const WorkerDetail = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <Stack direction={"column"} gap={6}>
      <PageHeader>Сотрудник #{id}</PageHeader>
    </Stack>
  );
};
