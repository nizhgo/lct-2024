import { PageHeader } from "components/pageHeader.tsx";
import { Stack } from "components/stack.ts";
import { Button } from "components/button.tsx";
import { useNavigate } from "react-router-dom";

const PassengerPage = () => {
  const navigate = useNavigate();
  const handleAdd = () => {
    navigate("/passenger/new");
  };
  return (
    <Stack direction={"column"} gap={6}>
      <Stack direction={"row"} justify={"space-between"} align={"center"}>
        <PageHeader>Пассажиры</PageHeader>
        <Button onClick={handleAdd}>Новый пассажир</Button>
      </Stack>
    </Stack>
  );
};

export default PassengerPage;
