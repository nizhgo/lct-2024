import { PageHeader } from "components/pageHeader.tsx";
import { Stack } from "components/stack.ts";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Text } from "components/text.ts";
import { Loader, LoaderWrapper } from "src/loader.tsx";
import { Button } from "components/button.tsx";
import { observer } from "mobx-react-lite";
import { useTheme } from "@emotion/react";
import { RequestDetailsViewModel } from "src/views/requests/details/request.detail.vm.ts";
import { RequestsDto } from "api/models/requests.model.ts";
import { findLineIconByName } from "src/assets/metro.tsx";
import styled from "@emotion/styled";
import { Tooltip } from "components/tooltip.tsx";

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
      <PageHeader>Заявка #{id}</PageHeader>
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
          <Button style={{ width: "fit-content" }} onClick={handleEdit}>
            Редактировать
          </Button>
        </GridItem>
        {vm.data.ticket && (
          <GridItem>
            <Text size={24}>Данные задачи</Text>
            <Stack direction={"column"} gap={6}>
              <ParamName>Маршрут</ParamName>
              <Text size={14}>{vm.data.ticket.route.join(" → ")}</Text>
            </Stack>
            <Stack direction={"column"} gap={6}>
              <ParamName>Дата и время начала</ParamName>
              {vm.data.datetime !== vm.data.ticket.start_time ? (
                <Tooltip content="Время поездки было перенесено" action={"hover"}>
                  <Text size={18} color={theme.colors.error}>
                    {new Date(vm.data.ticket.start_time).toLocaleString()}
                  </Text>
                </Tooltip>
              ) : (
                <Text size={18}>
                  {new Date(vm.data.ticket.start_time).toLocaleString()}
                </Text>
              )}
            </Stack>
            <Stack direction={"column"} gap={6}>
              <ParamName>Дата и время окончания</ParamName>
              <Text size={18}>
                {vm.data.ticket.end_time
                  ? new Date(vm.data.ticket.end_time).toLocaleString()
                  : "Не завершено"}
              </Text>
            </Stack>
            <Stack direction={"column"} gap={6}>
              <ParamName>Фактическое время окончания</ParamName>
              <Text size={18}>
                {vm.data.ticket.real_end_time
                  ? new Date(vm.data.ticket.real_end_time).toLocaleString()
                  : "Не завершено"}
              </Text>
            </Stack>
            <Stack direction={"column"} gap={6}>
              <ParamName>Дополнительная информация</ParamName>
              <Text size={18}>
                {vm.data.ticket.additional_information ||
                  "Информация отсутствует"}
              </Text>
            </Stack>
            <Stack direction={"column"} gap={10}>
              <ParamName>Статус</ParamName>
              <Tab color={theme.colors.status.processed_auto}>
                <Text color={theme.colors.text}>{vm.data.ticket.status}</Text>
              </Tab>
            </Stack>
            <Stack direction={"column"} gap={6}>
              <ParamName>Исполнители</ParamName>
              {vm.data.ticket.users.map((user) => (
                <Link to={`/staff/${user.id}`}>
                  <Text
                    key={user.id}
                    size={18}
                  >{`${user.second_name} ${user.first_name} ${user.patronymic}`}</Text>
                </Link>
              ))}
            </Stack>
          </GridItem>
        )}
      </GridContainer>
    </Stack>
  );
});

export default RequestDetails;
