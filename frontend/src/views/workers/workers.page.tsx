import styled from "@emotion/styled";
import { Button } from "components/button.tsx";
import { Link, useNavigate } from "react-router-dom";
import { Stack } from "components/stack.ts";
import { useState } from "react";
import { WorkersPageViewModel } from "src/views/workers/workers.vm.ts";
import { Loader, LoaderWrapper } from "src/loader.tsx";
import { observer } from "mobx-react-lite";
import { PageHeader } from "components/pageHeader.tsx";
import { Input } from "components/input.tsx";
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

const WorkersPage = observer(() => {
  const [vm] = useState(() => new WorkersPageViewModel());
  const navigate = useNavigate();
  const handleAdd = () => {
    navigate("/staff/registration");
  };

  const headers = [
    "ФИО",
    "Пол",
    "Режим работы",
    "Табельный номер",
    "Должность",
    "Работает сейчас",
  ];

  const renderRow = (worker: any) => (
    <>
      <GridCell header={"ФИО"}>
        <Link to={`/staff/${worker.id}`}>{worker.full_name}</Link>
      </GridCell>
      <GridCell header={"Пол"}>
          {worker.sex}</GridCell>
      <GridCell header={"Режим работы"}>
          {worker.shift}
      </GridCell>
      <GridCell header={"Табельный номер"}>
          {worker.personnel_number}</GridCell>
      <GridCell header={"Должность"}>
          {worker.role}</GridCell>
      <GridCell header={"Работает сейчас"}>
        <StatusBadge status={Math.random() > 0.5 ? "active" : "inactive"}>
          {Math.random() > 0.5 ? "Да" : "Нет"}
        </StatusBadge>
      </GridCell>
    </>
  );

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
        <>
          <Stack direction={"row"} align={"center"} gap={10}>
            <Input placeholder={"Поиск"} style={{ width: "300px" }} />
          </Stack>
          <ResponsiveTable
            headers={headers}
            columnSizes={["1.5fr", "0.5fr", "1fr", "1fr", "1fr", "1fr"]}
            data={vm.staff}
            renderRow={renderRow}
          />
        </>
      )}
    </Stack>
  );
});

export default WorkersPage;

const StatusBadge = styled.div<{ status: string }>`
  padding: 6px 8px;
  border-radius: 4px;
  color: ${(p) =>
    p.status === "active"
      ? p.theme.colors.status.active
      : p.theme.colors.status.inactive};
  background-color: ${(p) =>
    p.status === "active"
      ? `${p.theme.colors.status.active}30`
      : `${p.theme.colors.status.inactive}30`};
  border: 1px solid
    ${(p) =>
      p.status === "active"
        ? p.theme.colors.status.active
        : p.theme.colors.status.inactive};
  font-weight: 700;
  text-align: center;
`;
