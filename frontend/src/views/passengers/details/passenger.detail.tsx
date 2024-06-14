import { PageHeader } from "components/pageHeader.tsx";
import { Stack } from "components/stack.ts";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Text } from "components/text.ts";
import { Loader, LoaderWrapper } from "src/loader.tsx";
import { Button } from "components/button.tsx";
import { observer } from "mobx-react-lite";
import styled from "@emotion/styled";
import { theme } from "src/assets/theme.ts";
import { PassengerDetailsViewModel } from "src/views/passengers/details/passenger.detail.vm.ts";
import { ColumnConfig, GridCell, ResponsiveTable } from "components/table.tsx";
import { RequestsDto } from "api/models/requests.model.ts";

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
    { header: "Время от" },
    { header: "Время до" },
    { header: "Станция от." },
    { header: "Станция приб." },
  ];
  const renderCellContent = (
    columnHeader: string,
    request: RequestsDto.Request,
  ) => {
    switch (columnHeader) {
      case "ID":
        return <Link to={`/requests/${request.id}`}>{request.id}</Link>;
      case "Дата":
        return request.datetime;
      case "Время от":
        return "-";
      case "Время до":
        return "-";
      case "Станция от.":
        return request.station_from;
      case "Станция приб.":
        return request.station_to;
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
          <Button
            type={"button"}
            style={{ width: "fit-content" }}
            onClick={handleEdit}
          >
            Редактировать
          </Button>
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
  );
});
