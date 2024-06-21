import { PageHeader } from "components/pageHeader.tsx";
import { Stack } from "components/stack.ts";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Text } from "components/text.ts";
import { Loader, LoaderWrapper } from "src/loader.tsx";
import { BackButton, Button } from "components/button.tsx";
import { observer } from "mobx-react-lite";
import styled from "@emotion/styled";
import { theme } from "src/assets/theme.ts";
import { StaffDetailsViewModel } from "src/views/staff/detail/staff.detail.vm.ts";
import { Svg } from "components/svg.tsx";
import BackArrowIcon from "src/assets/icons/arrow_undo_up_left.svg";

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

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 64px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const GridItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StaffDetails = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vm] = useState(() => new StaffDetailsViewModel(id!));

  useEffect(() => {
    vm.loadStaff();
  }, [vm]);

  const handleEdit = () => {
    navigate(`/staff/${id}/edit`);
  };

  if (vm.loading && !vm.data) {
    return (
      <LoaderWrapper height={"100%"}>
        <Loader />
      </LoaderWrapper>
    );
  }

  if (!vm.data) {
    return <Text>Сотрудник не найден</Text>;
  }

  return (
    <>
      <BackButton onClick={() => navigate(-1)}>
        <Stack align={"center"} gap={6}>
          <Svg src={BackArrowIcon} width={20} color={"black"} />
          <Text size={16}>Назад</Text>
        </Stack>
      </BackButton>
      <Stack direction={"column"} gap={30}>
        <PageHeader>Сотрудник #{id}</PageHeader>
        <GridContainer>
          <GridItem>
            <ResponsiveStack>
              <Stack direction={"column"} gap={20}>
                <Text size={24}>Данные сотрудника</Text>
                <Stack direction={"column"} gap={6}>
                  <ParamName>ФИО</ParamName>
                  <Text size={18}>
                    {vm.data.second_name} {vm.data.first_name} {vm.data.patronymic}
                  </Text>
                </Stack>
                <Stack direction={"column"} gap={6}>
                  <ParamName>Пол</ParamName>
                  <Text size={18}>
                    {vm.data.sex === "male" ? "Мужской" : "Женский"}
                  </Text>
                </Stack>
                <Stack direction={"column"} gap={6}>
                  <ParamName>Раб. номер телефона</ParamName>
                  <Text size={18}>{vm.data.work_phone}</Text>
                </Stack>
                <Stack direction={"column"} gap={6}>
                  <ParamName>Личн. номер телефона</ParamName>
                  <Text size={18}>{vm.data.personal_phone}</Text>
                </Stack>
                <Stack direction={"column"} gap={10}>
                  <ParamName>Должность</ParamName>
                  <Tab color={"#FFCED1"}>
                    <Text color={"#D9232E"}>{vm.data.rank}</Text>
                  </Tab>
                </Stack>
                <Stack direction={"column"} gap={10}>
                  <ParamName>Только легкий труд?</ParamName>
                  {vm.data.is_lite ? (
                    <Tab color={"#FFCED1"}>
                      <Text color={"#D9232E"}>Да</Text>
                    </Tab>
                  ) : (
                    <Tab color={"#16C09838"}>
                      <Text color={"#008767"}>Нет</Text>
                    </Tab>
                  )}
                </Stack>
                <Button style={{ width: "fit-content" }} onClick={handleEdit}>
                  Редактировать
                </Button>
              </Stack>
            </ResponsiveStack>
          </GridItem>
          <GridItem>
            <Text size={24}>Расписание сотрудника</Text>
          </GridItem>
        </GridContainer>
      </Stack>
    </>
  );
});

const ResponsiveStack = styled(Stack)`
  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 20px;
  }
`;

export default StaffDetails;
