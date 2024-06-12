import { PageHeader } from "components/pageHeader.tsx";
import { Stack } from "components/stack.ts";
import { useParams } from "react-router-dom";

export const PassengerEdit = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <Stack direction={"column"} gap={6}>
      <PageHeader>Пассажир #{id}</PageHeader>
    </Stack>
  );
};
