import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { observer } from "mobx-react-lite";
import styled from "@emotion/styled";
import { theme } from "src/assets/theme.ts";
import { Text } from "components/text.ts";
import { Stack } from "components/stack.ts";
import { Input } from "components/input";
import { CustomDropdown } from "components/dropdown.tsx";
import { Button } from "components/button.tsx";
import { PageHeader } from "components/pageHeader.tsx";
import { useEffect, useState } from "react";
import { StaffEditViewModel } from "src/views/staff/edit/staff.edit.vm.ts";
import { UsersDto } from "api/models/users.model.ts";
import { useNavigate, useParams } from "react-router-dom";
import { Loader, LoaderWrapper } from "src/loader.tsx";

export const ShiftButton = styled(Button)<{ active?: boolean }>`
  background-color: ${({ active }) =>
    active ? theme.colors.primary : "transparent"};
  color: ${({ active }) => (active ? "#fff" : theme.colors.text)};
  border: 1px solid ${theme.colors.primary};
  &:hover {
    background-color: ${theme.colors.primary};
    color: #fff;
  }
`;

const PageLayout = styled.div`
  display: grid;
  grid-template-columns: 500px auto;
  grid-template-rows: 1fr;
  height: 100vh;

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const StaffEditPage = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vm] = useState(() => new StaffEditViewModel(id!));

  useEffect(() => {
    vm.loadStaff();
  }, [vm]);

  const {
    control,
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UsersDto.UserUpdateForm>({
    resolver: zodResolver(UsersDto.UserUpdateForm),
  });

  useEffect(() => {
    if (vm.data) {
      reset(vm.data);
    }
  }, [vm.data, reset]);

  const onSubmit = async (data: UsersDto.UserUpdateForm) => {
    console.log("onSubmit", data);
    const isUpdated = await vm.onSubmit(data);
    if (isUpdated) {
      navigate(`/staff/${id}`);
    }
  };

  const selectedArea = useWatch({
    control,
    name: "area",
  });

  if (vm.loading && !vm.data) {
    return (
      <LoaderWrapper height={"100%"}>
        <Loader />
      </LoaderWrapper>
    );
  }

  if (!vm.data) {
    return <Text>Сотрудник не найден</Text>;
  }

  return (
    <Stack wFull hFull direction={"column"} gap={20}>
      <PageHeader>Редактировать сотрудника</PageHeader>
      <PageLayout>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            direction="column"
            gap={20}
            wFull
            style={{ maxWidth: "555px" }}
          >
            <Input
              label="Фамилия"
              placeholder="Введите фамилию"
              error={errors.second_name?.message?.toString()}
              register={register("second_name")}
              required
            />
            <Input
              label="Имя"
              placeholder="Введите имя"
              error={errors.first_name?.message?.toString()}
              register={register("first_name")}
              required
            />
            <Input
              label="Отчество"
              placeholder="Введите отчество"
              error={errors.patronymic?.message?.toString()}
              register={register("patronymic")}
              required
            />
            <Controller
              name="sex"
              control={control}
              render={({ field }) => (
                <CustomDropdown
                  label="Пол"
                  options={UsersDto.genderValues}
                  onChange={field.onChange}
                  value={field.value}
                  error={errors.sex?.message?.toString()}
                  required
                  render={(option) => UsersDto.localizeGender(option)}
                />
              )}
            />
            <Input
              label="Раб. номер телефона"
              placeholder="Введите рабочий номер телефона"
              error={errors.work_phone?.message?.toString()}
              register={register("work_phone")}
              required
            />
            <Input
              label="Личн. номер телефона"
              placeholder="Введите личный номер телефона"
              error={errors.personal_phone?.message?.toString()}
              register={register("personal_phone")}
              required
            />
            <Input
              label="Табельный номер"
              placeholder="Введите табельный номер"
              error={errors.personnel_number?.message?.toString()}
              register={register("personnel_number")}
              required
            />
            <Controller
              name="rank"
              control={control}
              render={({ field }) => (
                <CustomDropdown
                  label="Должность"
                  disabledOptions={["Не выбрано"]}
                  options={UsersDto.ranksValues}
                  onChange={field.onChange}
                  value={field.value}
                  error={errors.role?.message?.toString()}
                  required
                />
              )}
            />
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <CustomDropdown
                  label="Роль"
                  disabledOptions={["Не выбрано" as UsersDto.Roles]} //cringe
                  options={UsersDto.rolesValues}
                  onChange={field.onChange}
                  render={(option) => UsersDto.localizeRole(option)}
                  value={field.value as UsersDto.Roles}
                  error={errors.role?.message?.toString()}
                  required
                />
              )}
            />
            <Text size={16}>Смена</Text>
            <Controller
              name="shift"
              control={control}
              render={({ field }) => (
                <Stack direction="row" gap={10}>
                  {UsersDto.shiftsValues.map((shift, index) => (
                    <ShiftButton
                      key={index}
                      active={field.value === shift}
                      onClick={() => field.onChange(shift)}
                    >
                      {shift}
                    </ShiftButton>
                  ))}
                  {errors.shift?.message?.toString()}
                </Stack>
              )}
            />
            <Controller
              name="area"
              control={control}
              render={({ field }) => (
                <CustomDropdown
                  label="Участок"
                  options={UsersDto.areasValues}
                  disabledOptions={["Не выбрано"]}
                  onChange={field.onChange}
                  value={field.value}
                  error={errors.area?.message?.toString()}
                  required
                />
              )}
            />
            <Controller
              name="working_hours"
              control={control}
              render={({ field }) => (
                <CustomDropdown
                  label="Время работы"
                  options={UsersDto.getWorkingHours(selectedArea)}
                  onChange={field.onChange}
                  value={field.value}
                  error={errors.working_hours?.message?.toString()}
                  required
                />
              )}
            />
            <Stack direction="row" align="center" gap={10}>
              <input type="checkbox" {...register("is_lite")} />
              <Text size={14}>Легкий труд</Text>
            </Stack>
            <Button type="submit">Сохранить</Button>
          </Stack>
        </form>
      </PageLayout>
    </Stack>
  );
});

export default StaffEditPage;
