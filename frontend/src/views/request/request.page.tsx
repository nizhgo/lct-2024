import { useNavigate } from "react-router-dom";
import { Stack } from "components/stack.ts";
import { PageHeader } from "components/pageHeader.tsx";
import { Button } from "components/button.tsx";

const RequestPage = () => {
  const navigate = useNavigate();
  const handleAdd = () => {
    navigate("/request/new");
  };
  return (
    <Stack direction={"column"} gap={6}>
      <Stack direction={"row"} justify={"space-between"} align={"center"}>
        <PageHeader>Заявки</PageHeader>
        <Button onClick={handleAdd}>Новая заявка</Button>
      </Stack>
    </Stack>
  );
};

export default RequestPage;
