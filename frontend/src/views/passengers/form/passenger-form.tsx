import { PageHeader } from "components/pageHeader.tsx";
import { Stack } from "components/stack.ts";
import { Input } from "components/input.tsx";
import { CustomDropdown } from "components/dropdown.tsx";
import { Text } from "components/text.ts";
import { Button } from "components/button.tsx";

export const PassengerForm = () => {
  return (
    <Stack direction={"column"} gap={20} wFull style={{ maxWidth: "555px" }}>
      <PageHeader>Регистрация пассажира</PageHeader>
      <Input placeholder={"Имя"} label={"Имя"} />
      <Input placeholder={"Фамилия"} label={"Фамилия"} />
      <Input placeholder={"Отчество"} label={"Отчество"} />
      <CustomDropdown
        label={"Пол"}
        options={["Мужской", "Женский"]}
        onChange={() => {}}
      />
      <Input placeholder={"Номер телефона"} label={"Номер телефона"} />
      <CustomDropdown
        label={"Категория"}
        options={[
          "ИЗТ",
          "ИЗ",
          "ИС",
          "ИК",
          "ИО",
          "ДИ",
          "ПЛ",
          "РД",
          "РДК",
          "ОГД",
          "ОВ",
          "ИУ",
        ]}
        onChange={() => {}}
      />
      <Stack direction={"row"} align={"center"} gap={10}>
        {/*//TODO: add checkbox component*/}
        <input type="checkbox" />
        <Text size={14}>Имеется электрокардио стимулятор</Text>
      </Stack>
      <Stack direction={"column"} gap={10}>
        {/*//TODO: add textarea component*/}
        <label htmlFor={"Комментарий"}>Комментарий</label>
        <textarea
          id="Комментарий"
          name="Комментарий"
          aria-rowcount={5}
          aria-colcount={33}
          defaultValue={"что-то"}
        />
      </Stack>
      <Button type="submit">Зарегистрировать</Button>
    </Stack>
  );
};
