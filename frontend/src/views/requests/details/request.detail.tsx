import { PageHeader } from "components/pageHeader.tsx";
import { Stack } from "components/stack.ts";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Text } from "components/text.ts";
import { Loader, LoaderWrapper } from "src/loader.tsx";
import { BackButton, Button } from "components/button.tsx";
import { observer } from "mobx-react-lite";
import { useTheme } from "@emotion/react";
import { RequestDetailsViewModel } from "src/views/requests/details/request.detail.vm.ts";
import { RequestsDto } from "api/models/requests.model.ts";
import { findLineIconByName } from "src/assets/metro.tsx";
import styled from "@emotion/styled";
import { Svg } from "components/svg.tsx";
import BackArrowIcon from "src/assets/icons/arrow_undo_up_left.svg";
import TicketDetails from "src/views/ticket/detail/ticket.detail.tsx";
import TicketForm from "src/views/ticket/form/ticket.form.tsx";

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

const RequestDetails = observer(() => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const distribute = Boolean(searchParams.get("distribute"));
  const navigate = useNavigate();
  const [vm] = useState(() => new RequestDetailsViewModel(id!));
  const theme = useTheme();

  useEffect(() => {
    vm.loadRequest();
  }, [vm]);

  const handleEdit = () => {
    navigate(`/requests/edit/${id}`);
  };

  if (vm.loading && !vm.data) {
    return (
      <LoaderWrapper height={"100%"}>
        <Loader />
      </LoaderWrapper>
    );
  }

  if (!vm.data) {
    return <Text>Заявка не найдена</Text>;
  }

  return (
    <Stack direction={"column"} gap={30}>
      <BackButton onClick={() => navigate(-1)}>
        <Stack align={"center"} gap={6}>
          <Svg src={BackArrowIcon} width={20} color={"black"} />
          <Text size={16}>Назад</Text>
        </Stack>
      </BackButton>
      <PageHeader>Заявка #{id} </PageHeader>
      <GridContainer>
        <GridItem>
          <Text size={24}>Данные заявки</Text>
          <Stack direction={"column"} gap={6}>
            <ParamName>ФИО пассажира</ParamName>
            <Text size={18}>{vm.data.passenger.name}</Text>
          </Stack>
          <Stack direction={"column"} gap={6}>
            <ParamName>Откуда</ParamName>
            <Text size={18}>
              {findLineIconByName(vm.data.station_from.name_line)}
              {vm.data.station_from.name_station}
            </Text>
          </Stack>
          <Stack direction={"column"} gap={6}>
            <ParamName>Куда</ParamName>
            <Text size={18}>
              {findLineIconByName(vm.data.station_to.name_line)}
              {vm.data.station_to.name_station}
            </Text>
          </Stack>
          <Stack direction={"column"} gap={6}>
            <ParamName>Дата и время</ParamName>
            <Text size={18}>{new Date(vm.data.datetime).toLocaleString()}</Text>
          </Stack>
          <Stack direction={"column"} gap={6}>
            <ParamName>Способ принятия</ParamName>
            <Text size={18}>{vm.data.acceptation_method}</Text>
          </Stack>
          <Stack direction={"column"} gap={6}>
            <ParamName>Количество пассажиров</ParamName>
            <Text size={18}>{vm.data.passengers_count}</Text>
          </Stack>
          <Stack direction={"column"} gap={10}>
            <ParamName>Категория</ParamName>
            <Tab color={"#FFCED1"}>
              <Text color={"#D9232E"}>{vm.data.category}</Text>
            </Tab>
          </Stack>
          <Stack direction={"column"} gap={6}>
            <ParamName>Количество мужчин</ParamName>
            <Text size={18}>{vm.data.male_users_count}</Text>
          </Stack>
          <Stack direction={"column"} gap={6}>
            <ParamName>Количество женщин</ParamName>
            <Text size={18}>{vm.data.female_users_count}</Text>
          </Stack>
          <Stack direction={"column"} gap={10}>
            <ParamName>Статус</ParamName>
            <Tab color={theme.colors.backgrounds[vm.data.status]}>
              <Text color={theme.colors.status[vm.data.status]}>
                {RequestsDto.localizeRequestStatus(vm.data.status)}
              </Text>
            </Tab>
          </Stack>
          <Stack direction={"column"} gap={6}>
            <ParamName>Дополнительная информация</ParamName>
            <Text size={18}>
              {vm.data.additional_information || "Информация отсутствует"}
            </Text>
          </Stack>
          <Stack direction={"column"} gap={6}>
            <ParamName>Тип багажа</ParamName>
            <Text size={18}>{vm.data.baggage_type}</Text>
          </Stack>
          <Stack direction={"column"} gap={6}>
            <ParamName>Вес багажа</ParamName>
            <Text size={18}>{vm.data.baggage_weight} кг</Text>
          </Stack>
          <Stack direction={"column"} gap={6}>
            <ParamName>Нужна помощь с багажом</ParamName>
            <Text size={18}>{vm.data.baggage_help ? "Да" : "Нет"}</Text>
          </Stack>
          <Button
            type={"button"}
            onClick={handleEdit}
            style={{ width: "fit-content" }}
          >
            Редактировать
          </Button>
        </GridItem>
        <GridItem>
          {!vm.data.ticket && distribute ? (
            <TicketForm />
          ) : (
            <TicketDetails data={vm.data} />
          )}
        </GridItem>
      </GridContainer>
    </Stack>
  );
});

export default RequestDetails;
