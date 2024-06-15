import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { Stack } from "components/stack.ts";
import { useState } from "react";
import { StaffPageViewModel } from "src/views/staff/staff.vm.ts";
import { observer } from "mobx-react-lite";
import { PageHeader } from "components/pageHeader.tsx";
import { ColumnConfig, GridCell } from "components/table.tsx";
import { UsersDto } from "api/models/users.model.ts";
import { Text } from "components/text.ts";
import { useTheme } from "@emotion/react";
import { Tooltip } from "components/tooltip.tsx";
import InfinityTable from "components/infinity-table.tsx";
import { CustomDropdown } from "components/dropdown.tsx";

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

const CheckinPage = observer(() => {
  const [vm] = useState(() => new StaffPageViewModel());
  const theme = useTheme();

  const columns: ColumnConfig[] = [
    { header: "ФИО" },
    { header: "Пол", centred: true },
    { header: "Режим работы", centred: true },
    { header: "Табельный номер", centred: true },
    { header: "Должность", centred: true },
    { header: "Присутствует", centred: true },
  ];

  const renderCellContent = (columnHeader: string, staff: UsersDto.User) => {
    switch (columnHeader) {
      case "ФИО":
        return (
          <Stack direction={"row"} align={"center"} gap={10}>
            <Link to={`/staff/${staff.id}`}>
              {staff.second_name} {staff.first_name} {staff.patronymic}
            </Link>
            {staff.role === "admin" && (
              <Tooltip content={"Администратор"} action={"hover"}>
                <Text fontFamily={"IcoMoon"} color={theme.colors.primary}>
                  
                </Text>
              </Tooltip>
            )}
          </Stack>
        );
      case "Пол":
        return UsersDto.localizeGender(staff.sex);
      case "Режим работы":
        return staff.shift;
      case "Табельный номер":
        return staff.personnel_number;
      case "Должность":
        return staff.rank;
      case "Присутствует":
        console.log(staff);
        return (
          <CustomDropdown
            options={["Да", "Нет"]}
            onChange={(e) => console.log(e)}
            value={"Да"}
          />
        );
      default:
        return null;
    }
  };

  const renderRow = (worker: UsersDto.User, columns: ColumnConfig[]) => (
    <>
      {columns.map((column, index) => (
        <GridCell key={index} header={column.header} centred={column.centred}>
          {renderCellContent(column.header, worker)}
        </GridCell>
      ))}
    </>
  );

  return (
    <Stack wFull hFull direction={"column"} gap={20}>
      <ContentHeader>
        <PageHeader>Посещаемость сотрудников</PageHeader>
      </ContentHeader>
      <InfinityTable
        columns={columns}
        provider={vm.provider}
        renderRow={renderRow}
      />
    </Stack>
  );
});

export default CheckinPage;
