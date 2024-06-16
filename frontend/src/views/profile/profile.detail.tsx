import { Stack } from "components/stack.ts";
import { PageHeader } from "components/pageHeader.tsx";
import { Text } from "components/text.ts";
import { useTheme } from "@emotion/react";
import AuthService from "src/stores/auth.service.ts";

export const ProfilePage = () => {
  const theme = useTheme();
  return (
    <Stack direction={"column"} gap={6}>
      <PageHeader>Профиль</PageHeader>
      <Stack direction={"column"} gap={14} style={{ marginTop: 32 }}>
        <img
          src={"https://placehold.co/130x160"}
          alt={"Фото"}
          style={{ maxWidth: 256 }}
        />
        <Stack direction={"row"} gap={6}>
          <Text weight={900}>ФИО:</Text>
          <Text color={theme.colors.textSecondary}>
            {AuthService.user?.second_name} {AuthService.user?.first_name}{" "}
            {AuthService.user?.patronymic}
          </Text>
        </Stack>
        <Stack direction={"row"} gap={6}>
          <Text weight={900}>Рабочий телефон:</Text>
          <Text color={theme.colors.textSecondary}>
            {AuthService.user?.work_phone}
          </Text>
        </Stack>
        <Stack direction={"row"} gap={6}>
          <Text weight={900}>Личный телефон:</Text>
          <Text color={theme.colors.textSecondary}>
            {AuthService.user?.personal_phone}
          </Text>
        </Stack>
        <Stack direction={"row"} gap={6}>
          <Text weight={900}>Табельный номер:</Text>
          <Text color={theme.colors.textSecondary}>
            {AuthService.user?.personnel_number}
          </Text>
        </Stack>
        <Stack direction={"row"} gap={6}>
          <Text weight={900}>Роль:</Text>
          <Text color={theme.colors.textSecondary}>
            {AuthService.user?.role}
          </Text>
        </Stack>
        <Stack direction={"row"} gap={6}>
          <Text weight={900}>Звание:</Text>
          <Text color={theme.colors.textSecondary}>
            {AuthService.user?.rank}
          </Text>
        </Stack>
        <Stack direction={"row"} gap={6}>
          <Text weight={900}>Смена:</Text>
          <Text color={theme.colors.textSecondary}>
            {AuthService.user?.shift}
          </Text>
        </Stack>
        <Stack direction={"row"} gap={6}>
          <Text weight={900}>Рабочие часы:</Text>
          <Text color={theme.colors.textSecondary}>
            {AuthService.user?.working_hours}
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
};
