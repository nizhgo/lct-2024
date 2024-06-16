import styled from "@emotion/styled";
import { Button } from "components/button.tsx";
import { Link, useNavigate } from "react-router-dom";
import { Stack } from "components/stack.ts";
import { observer } from "mobx-react-lite";
import { PageHeader } from "components/pageHeader.tsx";
import { ColumnConfig, GridCell } from "components/table.tsx";
import { RequestsDto } from "api/models/requests.model.ts";
import { findLineIconByName } from "src/assets/metro.tsx";
import { RequestsPageViewModel } from "src/views/requests/requests.vm.ts";
import { useState } from "react";
import InfinityTable from "components/infinity-table.tsx";
import {RequestsEndpoint} from "api/endpoints/requests.endpoint.ts";

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: ${(p) => p.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
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

const RequestsPage = observer(() => {
  const [vm] = useState(() => new RequestsPageViewModel());
  const navigate = useNavigate();

  const columns: ColumnConfig[] = [
    { header: "ID", size: "80px" },
    { header: "ФИО пассажира" },
    { header: "Откуда" },
    { header: "Куда" },
    { header: "Дата и время", centred: true },
    { header: "Статус", centred: true },
  ];

  const renderCellContent = (
    columnHeader: string,
    request: RequestsDto.Request,
  ) => {
    switch (columnHeader) {
      case "ID":
        return <Link to={`/requests/${request.id}`}>{request.id}</Link>;
      case "ФИО пассажира":
        return (
          <Link to={`/passengers/${request.passenger_id}`}>
            {request.passenger.name}
          </Link>
        );
      case "Откуда": {
        return (
          <Stack direction={"row"} gap={5} align={"center"}>
            {findLineIconByName(request.station_from.name_line)}
            {request.station_from.name_station}
          </Stack>
        );
      }
      case "Куда": {
        return (
          <Stack direction={"row"} gap={5} align={"center"}>
            {findLineIconByName(request.station_to.name_line)}
            {request.station_to.name_station}
          </Stack>
        );
      }
      case "Дата и время":
        return new Date(request.datetime).toLocaleString();
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

  const onDistribute = async () => {
    RequestsEndpoint.autoDistribute().then((data) => console.log(data));
  };

  return (
    <Stack wFull hFull direction={"column"} gap={20}>
      <ContentHeader>
        <PageHeader>Заявки</PageHeader>
        <Stack gap={20}>
          <Button onClick={onDistribute}>Распределить заявки</Button>
          <Button onClick={() => navigate("/requests/new")}>
            Добавить заявку
          </Button>
        </Stack>
      </ContentHeader>

      <InfinityTable
        provider={vm.provider}
        columns={columns}
        renderRow={renderRow}
        searchPlaceholder={"Поиск"}
      />
    </Stack>
  );
});

export default RequestsPage;
