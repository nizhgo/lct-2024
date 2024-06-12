import { Text } from "components/text.ts";
import { Stack } from "components/stack.ts";
import { Input } from "components/input.tsx";
import { CustomDropdown } from "components/dropdown.tsx";
import { Button } from "components/button.tsx";
import styled from "@emotion/styled";
import { theme } from "src/assets/theme.ts";
import { PageHeader } from "components/pageHeader.tsx";

export const ShiftButton = styled(Button)<{ active?: boolean }>`
  background-color: ${({ active }) =>
    active ? theme.colors.primary : "transparent"};
  color: ${({ active }) => (active ? "#fff" : theme.colors.text)};
  border: 1px solid ${theme.colors.primary};
  &:hover {
    background-color: ${theme.colors.primary};
    color: #fff;
  }
`;

const WorkerRegPage = () => {
  return (
    <Stack direction={"column"} gap={20} wFull style={{ maxWidth: "555px" }}>
      <PageHeader>Регистрация сотрудника</PageHeader>
      <Input placeholder={"Имя"} label={"Имя"} />
      <Input placeholder={"Фамилия"} label={"Фамилия"} />
      <Input placeholder={"Отчество"} label={"Отчество"} />
      <CustomDropdown
        label={"Пол"}
        options={["Мужской", "Женский"]}
        onChange={() => {}}
      />
      <Input
        placeholder={"Раб. номер телефона"}
        label={"Раб. номер телефона"}
      />
      <Input
        placeholder={"Личн. номер телефона"}
        label={"Личн. номер телефона"}
      />
      <Input placeholder={"Табельный номер"} label={"Табельный номер"} />
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
      <Button type="submit">Зарегистрировать</Button>
    </Stack>
  );
};

export default WorkerRegPage;
