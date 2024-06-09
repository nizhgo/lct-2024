import { Tooltip } from "components/tooltip.tsx";
import { Text } from "components/text.ts";
import { Stack } from "components/stack.ts";

export const MainPage = () => {
  return (
    <Stack direction={"column"} gap={20} align={"center"}>
      <Tooltip content="ого тултип (некрасывый работает)" action={"hover"}>
        <Text size={16}>тест тултипа</Text>
      </Tooltip>
      <Text>
        В чем прикол переделанного роутинга, мы можешь иметь общий лейаут для
        всех страниц. И так можно делать с любыми вложенными роутами
      </Text>
    </Stack>
  );
};

export default MainPage;
