import { Stack } from "components/stack.ts";
import { Text } from "components/text.ts";

export const ErrorTemplate = () => {
  return (
    <Stack
      direction={"column"}
      gap={14}
      justify={"center"}
      align={"center"}
      style={{ height: "100vh" }}
    >
      <Text size={16}>Произошла ошибка :-(</Text>
      <Text fontFamily={"IcoMoon"} size={24} weight={900}>
        
      </Text>
    </Stack>
  );
};

export default ErrorTemplate;
