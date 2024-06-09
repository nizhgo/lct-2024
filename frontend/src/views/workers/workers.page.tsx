import { Text } from "components/text.ts";
import styled from "@emotion/styled";
import { Button } from "components/button.tsx";
import { useNavigate } from "react-router-dom";
import { Stack } from "components/stack.ts";
import { useState } from "react";
import { WorkersPageViewModel } from "src/views/workers/workers.vm.ts";
import { Loader, LoaderWrapper } from "src/loader.tsx";
import { observer } from "mobx-react-lite";
import { WorkersDto } from "api/models/workers.mode.ts";
import { useTheme } from "@emotion/react";
import {PageHeader} from "components/pageHeader.tsx";

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const WorkersPage = observer(() => {
  const [vm] = useState(() => new WorkersPageViewModel());
  const navigate = useNavigate();
  const handleAdd = () => {
    navigate("/worker/registration"); // Перенаправление после успешного входа
  };

  return (
    <Stack wFull hFull direction={"column"} gap={20}>
      <ContentHeader>
        <PageHeader>Сотрудники</PageHeader>
        <Button onClick={handleAdd}>Добавить сотрудника</Button>
      </ContentHeader>

      {vm.isLoading ? (
        <LoaderWrapper height={"100%"}>
          <Loader />
        </LoaderWrapper>
      ) : (
        <Stack direction={"column"} gap={6}>
          {vm.staff.map((worker) => (
            <WorkerCard item={worker} key={worker.id} />
          ))}
        </Stack>
      )}
    </Stack>
  );
});

export default WorkersPage;

const WorkerCard = (x: { item: WorkersDto.Worker }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const onCardClick = () => {
    navigate(`/worker/${x.item.id}`);
  };
  return (
    <WorkerWrapper onClick={onCardClick}>
      <Stack direction={"column"} gap={6}>
        <Text size={16} weight={900}>
          {" "}
          <Text fontFamily={"IcoMoon"} color={theme.colors.primary}>
            
          </Text>{" "}
          {x.item.name} {x.item.middleName} {x.item.lastName}
        </Text>
        <Text size={14}>{x.item.position}</Text>
        <Text size={14}>{x.item.area}</Text>
      </Stack>
    </WorkerWrapper>
  );
};

const WorkerWrapper = styled.div`
  display: flex;
  background: ${(p) => p.theme.colors.background};
  gap: 20px;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid ${(p) => p.theme.colors.inputBorder};
  width: 100%;
`;
