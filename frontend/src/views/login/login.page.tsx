import { observer } from "mobx-react-lite";
import styled from "@emotion/styled";
import { theme } from "src/assets/theme.ts";
import logo from "src/assets/logo.svg";
import { Loader, LoaderWrapper } from "src/loader.tsx";
import { useEffect, useState } from "react";
import { Text } from "src/components/text.ts";
import { Stack } from "src/components/stack.ts";
import { Svg } from "src/components/svg.tsx";
import { Button } from "components/button.tsx";
import { Input } from "components/input";
import { LoginPageViewModel } from "src/views/login/login.page.vm.ts";
import { useNavigate } from "react-router-dom";

const PageLayout = styled.div`
  display: grid;
  grid-template-columns: 500px auto;
  grid-template-rows: 1fr;
  height: 100vh;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LoginContainer = styled.div`
  background: ${theme.colors.background};
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 64px;
`;

export const LoginPage = observer(() => {
  const [vm] = useState(() => new LoginPageViewModel());
  const [showLoader, setShowLoader] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      setShowLoader(false);
      //just for testing
    }, 1000);
  }, []);

  const handleSubmit = async () => {
    const isLoggedIn = await vm.onSubmit();
    if (isLoggedIn) {
      navigate("/"); // Перенаправление после успешного входа
    }
  };

  if (showLoader) {
    return (
      <LoaderWrapper height={"100vh"}>
        <Loader />
      </LoaderWrapper>
    );
  }
  return (
    <PageLayout>
      <LoginContainer>
        <Stack direction={"row"} gap={14}>
          <Svg src={logo} width={32} />
          <Text size={24} weight={900}>
            Project M
          </Text>
        </Stack>
        <form>
          <Stack direction={"column"} gap={24}>
            <Text size={24} weight={900}>
              Вход в систему
            </Text>
            <Input
              label={"Почта"}
              value={vm.form.email}
              withClear
              onChange={(v) => (vm.form.email = v)}
              placeholder={"Введите почту"}
            />
            <Input
              label={"Пароль"}
              type={"password"}
              withClear
              value={vm.form.password}
              onChange={(v) => (vm.form.password = v)}
              placeholder={"Введите пароль"}
            />
            <Button onClick={handleSubmit} type={"button"} variant={"red"}>
              Войти
            </Button>
          </Stack>
        </form>
      </LoginContainer>
      <div />
    </PageLayout>
  );
});
