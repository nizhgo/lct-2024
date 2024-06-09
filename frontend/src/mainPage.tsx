import { Tooltip } from "components/tooltip.tsx";
import { Text } from "components/text.ts";
import { Stack } from "components/stack.ts";
import { PageHeader } from "components/pageHeader.tsx";
import { Button } from "components/button.tsx";
import { Input } from "components/input.tsx";
import { CustomDropdown } from "components/dropdown.tsx";

export const MainPage = () => {
  return (
    <Stack direction={"column"} gap={6} style={{ width: "512px" }}>
      <PageHeader>Главная страница</PageHeader>
      <Button>Кнопка</Button>
      <Button variant={"blue"}>Кнопка</Button>
      <Button variant={"black"}>Кнопка</Button>
      <Button.Transparent>Кнопка</Button.Transparent>
      <Button.Transparent variant={"blue"}>Кнопка</Button.Transparent>
      <Button.Transparent variant={"black"}>Кнопка</Button.Transparent>
      <Input placeholder={"Инпут"} label={"Инпут"} />
      <Input placeholder={"Инпут"} label={"Инпут"} error={"Ошибка"} />
      <Input placeholder={"Инпут"} label={"Инпут"} error={"Ошибка"} disabled />
      <CustomDropdown
        label={"Дропдаун"}
        onChange={(value) => console.log(value)}
        options={["Опция 1", "Опция 2", "Опция 3"]}
      />
      <Tooltip content={"Тултип"} action={"hover"}>
        <Text>Наведи на меня</Text>
      </Tooltip>
    </Stack>
  );
};

export default MainPage;
