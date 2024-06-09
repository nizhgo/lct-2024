import { Stack } from "components/stack.ts";
import { PageHeader } from "components/pageHeader.tsx";

export const ProfilePage = () => {
  return (
    <Stack direction={"column"} gap={6}>
      <PageHeader>Профиль</PageHeader>
    </Stack>
  );
};
