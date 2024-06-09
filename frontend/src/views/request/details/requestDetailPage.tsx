import { useParams } from "react-router-dom";
import { Stack } from "components/stack.ts";
import { PageHeader } from "components/pageHeader.tsx";

const RequestDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <Stack direction={"column"} gap={6}>
      <Stack direction={"row"} justify={"space-between"} align={"center"}>
        <PageHeader>Заявка #${id}</PageHeader>
      </Stack>
    </Stack>
  );
};

export default RequestDetailPage;
