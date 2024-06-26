import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
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
import { Svg } from "components/svg.tsx";
import BackArrowIcon from "src/assets/icons/arrow_undo_up_left.svg";
import { BackButton } from "components/button.tsx";
import { InternalLink } from "components/internalLink.tsx";
import PermissionsService from "src/stores/permissions.service.ts";

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
  const navigate = useNavigate();

  const onCheck = async (data: string) => {
    await vm.onCheck(data);
  };

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
            <InternalLink
              to={`/staff/${staff.id}`}
              disabled={!PermissionsService.canRead("staff")}
            >
              {staff.second_name} {staff.first_name} {staff.patronymic}
            </InternalLink>
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
            onChange={() => onCheck(String(staff.id))}
            value={staff.is_working ? "Да" : "Нет"}
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
      <BackButton onClick={() => navigate(-1)}>
        <Stack align={"center"} gap={6}>
          <Svg src={BackArrowIcon} width={20} color={"black"} />
          <Text size={16}>Назад</Text>
        </Stack>
      </BackButton>
      <ContentHeader>
        <PageHeader>Посещаемость сотрудников</PageHeader>
      </ContentHeader>
      <InfinityTable
        columns={columns}
        provider={vm.provider}
        renderRow={renderRow}
        filters={{
          sex_query: ({ onChange }) => (
            <CustomDropdown
              label="Пол"
              options={[
                { value: "male", label: "Мужской" },
                { value: "female", label: "Женский" },
              ]}
              render={(option) => option.label}
              onChange={(option) => onChange(option.value)}
            />
          ),
          rank_query: ({ onChange }) => (
            <CustomDropdown
              label="Должность"
              options={UsersDto.ranksValues}
              onChange={(option) => onChange(option)}
            />
          ),
          shift_query: ({ onChange }) => (
            <CustomDropdown
              label="Режим работы"
              options={UsersDto.shiftsValues}
              onChange={(option) => onChange(option)}
            />
          ),
        }}
      />
    </Stack>
  );
});

export default CheckinPage;
