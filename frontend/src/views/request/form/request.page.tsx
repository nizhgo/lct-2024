import {Stack} from "components/stack.ts";
import {PageHeader} from "components/pageHeader.tsx";
import {Input} from "components/input.tsx";
import {CustomDropdown} from "components/dropdown.tsx";
import {Text} from "components/text.ts";
import {Button} from "components/button.tsx";

const RequestFormPage = () => {
  return (
    <Stack direction={"column"} gap={20} wFull style={{ maxWidth: "555px" }}>
      <PageHeader>Создание заявки</PageHeader>
      <Input placeholder={""} label={"Пассажир"} />
      <Input placeholder={""} label={"Станция отправления"} />
      <Input placeholder={""} label={"Станция прибытия"} />
      <Input placeholder={""} label={"Дата"} />
      <CustomDropdown
        label={"Способ принятия заявки"}
        options={["По телефону", "По электронной почте"]}
        onChange={() => {}}
      />
      <Input placeholder={""} label={"Количество пассажиров"} />
      <Input placeholder={""} label={"Количество персонала"} />
      <Input placeholder={""} label={"Тип багажа"} />
      <Input placeholder={""} label={"Вес багажа"} />
      <Stack direction={"row"} align={"center"} gap={10}>
        {/*//TODO: add checkbox component*/}
        <input type="checkbox" />
        <Text size={14}>Нужна помощь с багажом</Text>
      </Stack>
      <Button type="submit">Создать</Button>
    </Stack>
  );
};

export default RequestFormPage;
