import { PageHeader } from "components/pageHeader.tsx";
import { Stack } from "components/stack.ts";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Text } from "components/text.ts";
import { Loader, LoaderWrapper } from "src/loader.tsx";
import { Button } from "components/button.tsx";
import { observer } from "mobx-react-lite";
import styled from "@emotion/styled";
import { theme } from "src/assets/theme.ts";
import { PassengerDetailsViewModel } from "src/views/passengers/details/passenger.detail.vm.ts";

const ParamName = (x: { children: React.ReactNode }) => {
  return <Text color={"#787486"}>{x.children}</Text>;
};

const Tab = (x: { color: string; children: React.ReactNode }) => {
  return (
    <div
      style={{
        backgroundColor: x.color,
        width: "fit-content",
        padding: "5px 10px",
        borderRadius: 20,
      }}
    >
      {x.children}
    </div>
  );
};

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px;

  @media (min-width: ${theme.breakpoints.mobile}) {
    flex-direction: row;
    gap: 200px;
  }
`;

const PassengerDetailsContainer = styled(Stack)`
  width: 100%;

  @media (min-width: ${theme.breakpoints.mobile}) {
    width: auto;
  }
`;

const DetailsSection = styled(Stack)`
  flex: 1;
  width: 100%;

  @media (min-width: ${theme.breakpoints.mobile}) {
    width: auto;
  }
`;

export const PassengerDetails = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vm] = useState(() => new PassengerDetailsViewModel(id!));

  useEffect(() => {
    vm.loadPassenger();
  }, [vm]);

  const handleEdit = () => {
    navigate(`/passengers/edit/${id}`);
  };

  if (vm.loading && !vm.data) {
    return (
      <LoaderWrapper height={"100%"}>
        <Loader />
      </LoaderWrapper>
    );
  }

  if (!vm.data) {
    return <Text>Пассажир не найден</Text>;
  }

  return (
    <PassengerDetailsContainer direction={"column"} gap={30}>
      <PageHeader>Пассажир #{id}</PageHeader>
      <PageLayout>
        <DetailsSection direction={"column"} gap={20}>
          <Text size={24}>Данные пассажира</Text>
          <Stack direction={"column"} gap={6}>
            <ParamName>ФИО</ParamName>
            <Text size={18}>{vm.data.name}</Text>
          </Stack>
          <Stack direction={"column"} gap={6}>
            <ParamName>Пол</ParamName>
            <Text size={18}>
              {vm.data.sex === "male" ? "Мужской" : "Женский"}
            </Text>
          </Stack>
          <Stack direction={"column"} gap={6}>
            <ParamName>Номер телефона</ParamName>
            <Text size={18}>{`+${vm.data.contact_details.slice(0, 1)} 
            (${vm.data.contact_details.slice(1, 4)}) ${vm.data.contact_details.slice(4, 7)}-${vm.data.contact_details.slice(7, 9)}-${vm.data.contact_details.slice(9, 11)}`}</Text>
          </Stack>
          <Stack direction={"column"} gap={10}>
            <ParamName>Категория</ParamName>
            <Tab color={"#FFCED1"}>
              <Text color={"#D9232E"}>{vm.data.category}</Text>
            </Tab>
          </Stack>
          <Stack direction={"column"} gap={10}>
            <ParamName>Имется электрокардио стимулятор?</ParamName>
            {vm.data.has_cardiac_pacemaker ? (
              <Tab color={"#FFCED1"}>
                <Text color={"#D9232E"}>Кардио стим.</Text>
              </Tab>
            ) : (
              <Tab color={"#16C09838"}>
                <Text color={"#008767"}>Отсутсвует</Text>
              </Tab>
            )}
          </Stack>
          <Stack direction={"column"} gap={6}>
            <ParamName>Комментарий</ParamName>
            <Text size={18}>
              {vm.data.additional_information || "Комментарий отсутствует"}
            </Text>
          </Stack>
          <Button style={{ width: "fit-content" }} onClick={handleEdit}>
            Редактировать
          </Button>
        </DetailsSection>
        <DetailsSection direction={"column"} gap={20}>
          <Text size={24}>Заявки</Text>
        </DetailsSection>
      </PageLayout>
    </PassengerDetailsContainer>
  );
});
