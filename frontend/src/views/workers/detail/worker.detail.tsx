import { useParams } from "react-router-dom";
import { Stack } from "components/stack.ts";
import { PageHeader } from "components/pageHeader.tsx";
import { Input } from "components/input.tsx";
import { CustomDropdown } from "components/dropdown.tsx";
import { Text } from "components/text.ts";
import styled from "@emotion/styled";
import { Button } from "components/button.tsx";
import { theme } from "src/assets/theme.ts";

const ShiftButton = styled(Button)<{ active?: boolean }>`
  background-color: ${({ active }) =>
    active ? theme.colors.primary : "transparent"};
  color: ${({ active }) => (active ? "#fff" : theme.colors.text)};
  border: 1px solid ${theme.colors.primary};
  &:hover {
    background-color: ${theme.colors.primary};
    color: #fff;
  }
`;

export const WorkerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const renderForm = (worker: any) => {
    return (
      <Stack direction={"column"} gap={20} wFull style={{ maxWidth: "555px" }}>
        <Input defaultValue={worker.name} label={"Имя"} />
        <Input defaultValue={worker.surname} label={"Фамилия"} />
        <Input defaultValue={worker.patronymic} label={"Отчество"} />
        <CustomDropdown
          label={"Пол"}
          options={["Мужской", "Женский"]}
          onChange={() => {}}
        />
        <Input defaultValue={worker.work_phone} label={"Раб. номер телефона"} />
        <Input
          defaultValue={worker.self_phone}
          label={"Личн. номер телефона"}
        />
        <Input defaultValue={worker.table_number} label={"Табельный номер"} />
        <CustomDropdown
          label={"Должность"}
          options={["Администратор", "Менеджер", "Полевой инженер"]}
          onChange={() => {}}
        />
        <Text size={16}>Смена</Text>
        <Stack direction={"row"} gap={10}>
          {["1", "2", "1н", "2н", "5"].map((shift, index) => (
            <ShiftButton key={index} size="small" type="button">
              {shift}
            </ShiftButton>
          ))}
        </Stack>
        <CustomDropdown
          label={"Участок"}
          options={["CU1", "CU2", "CU3"]}
          onChange={() => {}}
        />
        <Stack direction={"row"} align={"center"} gap={10}>
          {/*//TODO: add checkbox component*/}
          <input type="checkbox" />
          <Text size={14}>Легкий труд</Text>
        </Stack>
        <Input placeholder={"Пароль"} label={"Пароль"} type="password" />
        <Stack direction={"row"}>
          <Button type="submit">Сохранить</Button>
          <Button>Удалить</Button>
        </Stack>
      </Stack>
    );
  };
  return (
    <Stack direction={"column"} gap={20} style={{ maxWidth: "500px" }}>
      <PageHeader>Сотрудник #{id}</PageHeader>
      {renderForm({ name: "Иван" })}
    </Stack>
  );
};
