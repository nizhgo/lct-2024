import { Stack } from "components/stack.ts";
import { Text } from "components/text.ts";
import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <Stack direction={"column"} gap={14} justify={"center"} align={"center"}>
      <PageHeader>404</PageHeader>
      <Text size={16} align={"center"}>
        Такой страницы не существует или она была удалена
      </Text>
      <Text
        fontFamily={"IcoMoon"}
        size={24}
        weight={900}
        color={theme.colors.primary}
      >
        
      </Text>
      <BackButton onClick={() => navigate(-1)}>Вернуться назад</BackButton>
    </Stack>
  );
};

export default NotFoundPage;

const PageHeader = styled.h1`
  font-size: 56px;
  font-weight: 700;
`;

const BackButton = styled.button`
  background: transparent;
  cursor: pointer;
  border: none;
  font-size: 16px;
  font-weight: 500;
  color: ${(p) => p.theme.colors.text};
  text-decoration: underline;
  text-decoration-style: dotted;
`;
