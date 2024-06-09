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
import {GridCell, ResponsiveTable} from "components/table.tsx";

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
  const navigate = useNavigate();
  const handleAdd = () => {
    navigate("/passengers/new");
  };

  const headers = ["ФИО", "Категория", "Описание", "Телефон"];
  const columnSizes = ["2fr", "1fr", "2fr", "1fr"];

  const renderRow = (passenger: PassengerDto.Passenger) => (
    <>
      <GridCell header={"ФИО"}>
        <Link to={`/passengers/${passenger.id}`}>{passenger.full_name}</Link>
      </GridCell>
      <GridCell header={"Категория"}>{passenger.category}</GridCell>
      <GridCell header={"Описание"}>{passenger.description}</GridCell>
      <GridCell header={"Телефон"}>{passenger.phone}</GridCell>
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
      ) : (
        <>
          <Stack direction={"row"} align={"center"} gap={10}>
            <Input placeholder={"Поиск"} style={{ width: "300px" }} />
          </Stack>
          <ResponsiveTable
            headers={headers}
            data={vm.passengers}
            renderRow={renderRow}
            columnSizes={columnSizes}
          />
        </>
      )}
    </Stack>
  );
});

export default PassengersPage;
