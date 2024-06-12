import styled from "@emotion/styled";
import { Button } from "components/button.tsx";
import { Link, useNavigate } from "react-router-dom";
import { Stack } from "components/stack.ts";
import { useState } from "react";
import { Loader, LoaderWrapper } from "src/loader.tsx";
import { observer } from "mobx-react-lite";
import { PageHeader } from "components/pageHeader.tsx";
import { Input } from "components/input.tsx";
import { PassengerDto } from "api/models/passenger.model.ts";
import { PassengersPageViewModel } from "src/views/passengers/passengers.vm.ts";
import { ColumnConfig, GridCell, ResponsiveTable } from "components/table.tsx";
import { Text } from "components/text.ts";
import { useTheme } from "@emotion/react";

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

const PassengersPage = observer(() => {
  const [vm] = useState(() => new PassengersPageViewModel());
  const theme = useTheme();
  const navigate = useNavigate();
  const handleAdd = () => {
    navigate("/passengers/new");
  };

  const columns: ColumnConfig[] = [
    { header: "ФИО", size: "2fr" },
    { header: "Пол" },
    { header: "Категория", centred: true },
    { header: "Описание" },
    { header: "Кардиостимулятор", centred: true },
    { header: "Телефон" },
  ];

  const renderCellContent = (
    columnHeader: string,
    passenger: PassengerDto.Passenger,
  ) => {
    switch (columnHeader) {
      case "ФИО":
        return <Link to={`/passengers/${passenger.id}`}>{passenger.name}</Link>;
      case "Пол":
        return passenger.sex === "male" ? "Мужчина" : "Женщина";
      case "Категория":
        return passenger.category;
      case "Описание":
        return (
          passenger.additional_information || (
            <Text color={theme.colors.textSecondary} align={"center"}>
              —
            </Text>
          )
        );
      case "Кардиостимулятор":
        return passenger.has_cardiac_pacemaker ? "Есть" : "Нет";
      case "Телефон":
        return passenger.contact_details;
      default:
        return null;
    }
  };

  const renderRow = (
    passenger: PassengerDto.Passenger,
    columns: ColumnConfig[],
  ) => (
    <>
      {columns.map((column, index) => (
        <GridCell key={index} header={column.header} centred={column.centred}>
          {renderCellContent(column.header, passenger)}
        </GridCell>
      ))}
    </>
  );

  return (
    <Stack wFull hFull direction={"column"} gap={20}>
      <ContentHeader>
        <PageHeader>Пассажиры</PageHeader>
        <Button onClick={handleAdd}>Новый пассажир</Button>
      </ContentHeader>

      {vm.isLoading ? (
        <LoaderWrapper height={"100%"}>
          <Loader />
        </LoaderWrapper>
      ) : vm.passengers.length === 0 ? (
        <div>Пассажиров нет</div>
      ) : (
        <>
          <Stack direction={"row"} align={"center"} gap={10}>
            <Input placeholder={"Поиск"} style={{ width: "300px" }} />
          </Stack>
          <ResponsiveTable
            columns={columns}
            data={vm.passengers}
            renderRow={renderRow}
          />
        </>
      )}
    </Stack>
  );
});

export default PassengersPage;
