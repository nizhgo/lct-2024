import { Stack } from "components/stack.ts";
import { Text } from "components/text.ts";
import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  const theme = useTheme();
  return (
    <Stack direction={"column"} gap={14} justify={"center"} align={"center"}>
      <PageHeader>404</PageHeader>
      <Text size={16}>Такой страницы не существует или она была удалена</Text>
      <Text
        fontFamily={"IcoMoon"}
        size={24}
        weight={900}
        color={theme.colors.primary}
      >
        
      </Text>
      <Link to={"/"}>Вернуться на главную</Link>
    </Stack>
  );
};
const PageHeader = styled.h1`
  font-size: 56px;
  font-weight: 700;
`;
