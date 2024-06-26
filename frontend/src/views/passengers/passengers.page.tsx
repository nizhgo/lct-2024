import styled from "@emotion/styled";
import { Button } from "components/button.tsx";
import { useNavigate } from "react-router-dom";
import { Stack } from "components/stack.ts";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { PageHeader } from "components/pageHeader.tsx";
import { ColumnConfig, GridCell } from "components/table.tsx";
import { PassengerDto } from "api/models/passenger.model.ts";
import { PassengersPageViewModel } from "src/views/passengers/passengers.vm.ts";
import { Text } from "components/text.ts";
import { useTheme } from "@emotion/react";
import InfinityTable from "components/infinity-table.tsx";
import { InternalLink } from "components/internalLink.tsx";
import PermissionService from "src/stores/permissions.service.ts";
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
        return (
          <InternalLink
            to={`/passengers/${passenger.id}`}
            disabled={!PermissionService.canRead("passengers")}
          >
            {passenger.name}
          </InternalLink>
        );
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
        {PermissionService.canCreate("passengers") && (
          <Button onClick={handleAdd}>Новый пассажир</Button>
        )}
      </ContentHeader>

      <InfinityTable
        provider={vm.provider}
        columns={columns}
        renderRow={renderRow}
        searchPlaceholder={"Поиск пассажиров"}
        filters={{
          sex_query: ({ onChange }) => (
            <CustomDropdown
              label="Пол"
              options={[
                { value: "", label: "Все" },
                { value: "male", label: "Мужчина" },
                { value: "female", label: "Женщина" },
              ]}
              render={(option) => option.label}
              onChange={(option) => onChange(option.value)}
            />
          ),
          category_query: ({ onChange }) => (
            <CustomDropdown
              label="Категория"
              options={PassengerDto.passengerCategoryValues}
              onChange={(option) => onChange(option)}
            />
          ),
          has_cardiac_pacemaker_query: ({ onChange }) => (
            <label>
              <input
                type="checkbox"
                onChange={(e) => onChange(String(e.target.checked))}
              />
              Кардиостимулятор
            </label>
          ),
        }}
      />
    </Stack>
  );
});

export default PassengersPage;
