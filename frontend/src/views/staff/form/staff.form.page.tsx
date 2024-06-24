import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { observer } from "mobx-react-lite";
import styled from "@emotion/styled";
import { theme } from "src/assets/theme.ts";
import { Text } from "components/text.ts";
import { Stack } from "components/stack.ts";
import { Input } from "components/input";
import { CustomDropdown } from "components/dropdown.tsx";
import { BackButton, Button } from "components/button.tsx";
import { PageHeader } from "components/pageHeader.tsx";
import { useState } from "react";
import { WorkerRegPageViewModel } from "src/views/staff/form/staff.form.vm.ts";
import { UsersDto } from "api/models/users.model.ts";
import { useNavigate } from "react-router-dom";
import { Svg } from "components/svg.tsx";
import BackArrowIcon from "src/assets/icons/arrow_undo_up_left.svg";
import { toast } from "react-toastify";

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

const WorkerRegPage = observer(() => {
  const [vm] = useState(() => new WorkerRegPageViewModel());
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UsersDto.UserForm>({
    resolver: zodResolver(UsersDto.UserForm),
  });
  const selectedArea = useWatch({
    control,
    name: "area",
  });

  const onSubmit = async (data: UsersDto.UserForm) => {
    console.log("onSubmit", data);
    const res = await vm.onSubmit(data);
    if (!res) return;
    toast.success(
      <Stack direction="column" gap={10}>
        <Text>Сотрудник успешно зарегистрирован</Text>
        <Text>Телефон: {res.personal_phone}</Text>
        <Text>Пароль: {res.password}</Text>
      </Stack>,
    );
    navigate("/staff");
  };

  return (
    <>
      <BackButton onClick={() => navigate(-1)}>
        <Stack align={"center"} gap={6}>
          <Svg src={BackArrowIcon} width={20} color={"black"} />
          <Text size={16}>Назад</Text>
        </Stack>
      </BackButton>
      <Stack wFull hFull direction={"column"} gap={20}>
        <PageHeader>Регистрация сотрудника</PageHeader>
        <PageLayout>
          <form onSubmit={handleSubmit(async (data) => await onSubmit(data))}>
            {/*{Object.keys(errors).map((key, index) => (*/}
            {/*  <Text key={index} color={theme.colors.error} size={12}>*/}
            {/*    {errors[key]?.message?.toString()}*/}
            {/*  </Text>*/}
            {/*))}*/}
            <Stack
              direction="column"
              gap={20}
              wFull
              style={{ maxWidth: "555px", marginBottom: "50px" }}
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
                    disabledOptions={["Не выбрано" as UsersDto.Genders]} //cringe
                    onChange={field.onChange}
                    value={field.value as UsersDto.Genders}
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
                        type="button"
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
                    //depends on area
                    options={UsersDto.getWorkingHours(selectedArea)}
                    onChange={field.onChange}
                    disabledOptions={["Не выбрано"]}
                    value={field.value}
                    error={errors.area?.message?.toString()}
                    required
                  />
                )}
              />
              <Stack direction="row" align="center" gap={10}>
                <input type="checkbox" {...register("is_lite")} />
                <Text size={14}>Легкий труд</Text>
              </Stack>
              <Button type="submit">Зарегистрировать</Button>
            </Stack>
          </form>
        </PageLayout>
      </Stack>
    </>
  );
});

export default WorkerRegPage;
