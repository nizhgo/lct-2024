import { PageHeader } from "components/pageHeader.tsx";
import { Stack } from "components/stack.ts";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Text } from "components/text.ts";
import { Loader, LoaderWrapper } from "src/loader.tsx";
import { BackButton, Button } from "components/button.tsx";
import { observer } from "mobx-react-lite";
import styled from "@emotion/styled";
import { theme } from "src/assets/theme.ts";
import { PassengerDetailsViewModel } from "src/views/passengers/details/passenger.detail.vm.ts";
import { ColumnConfig, GridCell, ResponsiveTable } from "components/table.tsx";
import { RequestsDto } from "api/models/requests.model.ts";
import BackArrowIcon from "src/assets/icons/arrow_undo_up_left.svg";
import { Svg } from "components/svg.tsx";
import { findLineIconByName } from "src/assets/metro.tsx";
import { InternalLink } from "components/internalLink.tsx";
import PermissionsService from "src/stores/permissions.service.ts";

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
  justify-content: space-between;
  gap: 30px;
  padding: 20px 0;

  @media (min-width: ${theme.breakpoints.mobile}) {
    flex-direction: row;
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

const StatusBadge = styled.div<{ status: string }>`
  padding: 6px 8px;
  border-radius: 4px;
  color: ${(p) =>
    p.status === "new"
      ? p.theme.colors.status.new
      : p.status === "processed_auto"
        ? p.theme.colors.status.processed_auto
        : p.status === "processed"
          ? p.theme.colors.status.processed
          : p.theme.colors.status.completed};
  background-color: ${(p) =>
    p.status === "new"
      ? `${p.theme.colors.status.new}30`
      : p.status === "processed_auto"
        ? `${p.theme.colors.status.processed_auto}30`
        : p.status === "processed"
          ? `${p.theme.colors.status.processed}30`
          : `${p.theme.colors.status.completed}30`};
  border: 1px solid
    ${(p) =>
      p.status === "new"
        ? p.theme.colors.status.new
        : p.status === "processed_auto"
          ? p.theme.colors.status.processed_auto
          : p.status === "processed"
            ? p.theme.colors.status.processed
            : p.theme.colors.status.completed};
  font-weight: 700;
  text-align: center;
`;

export const PassengerDetails = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vm] = useState(() => new PassengerDetailsViewModel(id!));

  useEffect(() => {
    vm.loadPassenger();
    vm.loadRequests();
  }, [vm]);

  const handleEdit = () => {
    navigate(`/passengers/edit/${id}`);
  };

  const columns: ColumnConfig[] = [
    { header: "ID" },
    { header: "Дата" },
    { header: "Станция отпр." },
    { header: "Станция приб." },
    { header: "Статус" },
  ];
  const renderCellContent = (
    columnHeader: string,
    request: RequestsDto.Request,
  ) => {
    switch (columnHeader) {
      case "ID":
        return (
          <InternalLink
            to={`/requests/${request.id}`}
            disabled={!PermissionsService.canRead("requests")}
          >
            {request.id}
          </InternalLink>
        );
      case "Дата":
        // eslint-disable-next-line no-case-declarations
        const date = new Date(request.datetime);
        return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
      case "Станция отпр.":
        return (
          <Text>
            {findLineIconByName(request.station_from.name_line)}
            {request.station_from.name_station}
          </Text>
        );
      case "Станция приб.":
        return (
          <Text>
            {findLineIconByName(request.station_to.name_line)}
            {request.station_to.name_station}
          </Text>
        );
      case "Статус":
        return (
          <StatusBadge status={request.status}>
            {RequestsDto.localizeRequestStatus(request.status)}
          </StatusBadge>
        );
      default:
        return null;
    }
  };
  const renderRow = (request: RequestsDto.Request, columns: ColumnConfig[]) => (
    <>
      {columns.map((column, index) => (
        <GridCell key={index} header={column.header} centred={column.centred}>
          {renderCellContent(column.header, request)}
        </GridCell>
      ))}
    </>
  );

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
    <>
      <BackButton onClick={() => navigate(-1)}>
        <Stack align={"center"} gap={6}>
          <Svg src={BackArrowIcon} width={20} color={"black"} />
          <Text size={16}>Назад</Text>
        </Stack>
      </BackButton>
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
            {PermissionsService.canUpdate("passengers") && (
              <Button
                type={"button"}
                style={{ width: "fit-content" }}
                onClick={handleEdit}
              >
                Редактировать
              </Button>
            )}
          </DetailsSection>
          <DetailsSection direction={"column"} gap={20}>
            <Text size={24}>Заявки</Text>
            <ResponsiveTable
              columns={columns}
              data={vm.requests}
              renderRow={renderRow}
            />
          </DetailsSection>
        </PageLayout>
      </PassengerDetailsContainer>
    </>
  );
});

export default PassengerDetails;
