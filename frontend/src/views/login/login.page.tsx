import { observer } from "mobx-react-lite";
import styled from "@emotion/styled";
import { theme } from "src/assets/theme.ts";
import logo from "src/assets/logo.svg";
import { useState } from "react";
import { Text } from "src/components/text.ts";
import { Stack } from "src/components/stack.ts";
import { Svg } from "src/components/svg.tsx";
import { Button } from "components/button.tsx";
import { Input } from "components/input";
import { LoginPageViewModel } from "src/views/login/login.page.vm.ts";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AuthDto } from "api/models/auth.model.ts";
import { useTheme } from "@emotion/react";

const PageLayout = styled.div`
  display: grid;
  grid-template-columns: 500px auto;
  grid-template-rows: 1fr;
  height: 100vh;

  @media (max-width: ${(p) => p.theme.breakpoints.mobile}) {
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

const schema = yup.object().shape({
  personal_phone: yup
    .string()
    // .matches(
    //   /^(\+7|7|8)?[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/,
    //   "Введите правильный номер телефона",
    // )
    .required("Поле обязательно для заполнения"),
  password: yup.string().required("Поле обязательно для заполнения"),
});

export const LoginPage = observer(() => {
  const [vm] = useState(() => new LoginPageViewModel());
  const navigate = useNavigate();
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: AuthDto.AuthForm) => {
    const isLoggedIn = await vm.onSubmit(data);
    if (isLoggedIn) {
      navigate("/"); // Перенаправление после успешного входа
    }
  };

  return (
    <PageLayout>
      <LoginContainer>
        <Stack direction={"row"} gap={14}>
          <Svg src={logo} width={32} />
          <Text size={24} weight={900}>
            Project M
          </Text>
        </Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction={"column"} gap={24}>
            <Text size={24} weight={900}>
              Вход в систему
            </Text>
            {vm.hasError && (
              <Text size={14} color={theme.colors.error}>
                Неверный логин или пароль
              </Text>
            )}
            <Input
              label={"Номер телефона"}
              placeholder={"Введите номер телефона"}
              error={errors.personal_phone?.message}
              register={register("personal_phone")}
              required
            />
            <Input
              label={"Пароль"}
              type={"password"}
              placeholder={"Введите пароль"}
              error={errors.password?.message}
              register={register("password")}
              onChange={(v) => console.log(v)}
              required
            />
            <Button type="submit" variant={"red"}>
              Войти
            </Button>
          </Stack>
        </form>
      </LoginContainer>
      <div />
    </PageLayout>
  );
});
