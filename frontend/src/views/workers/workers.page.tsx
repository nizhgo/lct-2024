import { Text } from "components/text.ts";
import styled from "@emotion/styled";
import { Button } from "components/button.tsx";
import { useNavigate } from "react-router-dom";

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const WorkersPage = () => {
  const navigate = useNavigate();
  const handleAdd = () => {
    navigate("/worker/registration"); // Перенаправление после успешного входа
  };

  return (
    <ContentHeader>
      <Text size={32}>Сотрудники</Text>
      <Button onClick={handleAdd}>Добавить сотрудника</Button>
    </ContentHeader>
  );
};

export default WorkersPage;
