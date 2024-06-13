import { useForm, Controller } from "react-hook-form";
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
import { useState } from "react";
import { PassengerDto } from "api/models/passenger.model.ts";
import { useNavigate } from "react-router-dom";
import { UsersDto } from "api/models/users.model.ts";
import { PassengerFormViewModel } from "src/views/passengers/form/passanger.form.vm.ts";

const PageLayout = styled.div`
  display: grid;
  grid-template-columns: 500px auto;
  grid-template-rows: 1fr;
  height: 100vh;

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const TextArea = styled.textarea`
  border: 1px solid ${(p) => p.theme.colors.inputBorder};
  width: 100%;
  font-size: 14px;
  font-weight: 400;
  color: ${(p) => p.theme.colors.textSecondary};
  padding: 8px;
  border-radius: 4px;
  background-color: ${(p) => p.theme.colors.input.background};
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.link};
  }
`;

const PassengerForm = observer(() => {
  const [vm] = useState(() => new PassengerFormViewModel());
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PassengerDto.PassengerForm>({
    resolver: zodResolver(PassengerDto.PassengerForm),
  });

  const onSubmit = async (data: PassengerDto.PassengerForm) => {
    console.log("onSubmit", data);
    const isRegistered = await vm.onSubmit(data);
    if (isRegistered) {
      navigate("/passengers");
    }
  };

  return (
    <Stack wFull hFull direction={"column"} gap={20}>
      <PageHeader>Регистрация пассажира</PageHeader>
      <PageLayout>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            direction="column"
            gap={20}
            wFull
            style={{ maxWidth: "555px" }}
          >
            <Input
              label="Имя"
              placeholder="Введите имя"
              error={errors.name?.message?.toString()}
              register={register("name")}
              required
            />
            <Input
              label="Контактные данные"
              placeholder="Введите контактные данные"
              error={errors.contact_details?.message?.toString()}
              register={register("contact_details")}
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
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <CustomDropdown
                  label="Категория"
                  options={PassengerDto.passengerCategoryValues}
                  onChange={field.onChange}
                  value={field.value}
                  error={errors.category?.message?.toString()}
                  required
                  render={(option) => option}
                />
              )}
            />
            <Stack direction={"row"} align={"center"} gap={10}>
              <input type="checkbox" {...register("has_cardiac_pacemaker")} />
              <Text size={14}>Имеется электрокардио стимулятор</Text>
            </Stack>
            <Stack direction={"column"} gap={10}>
              <label htmlFor={"additional_information"}>Комментарий</label>
              <TextArea
                id="additional_information"
                {...register("additional_information")}
                aria-rowcount={5}
                aria-colcount={33}
                placeholder="Введите дополнительную информацию"
              />
            </Stack>
            <Button type="submit">Зарегистрировать</Button>
          </Stack>
        </form>
      </PageLayout>
    </Stack>
  );
});

export default PassengerForm;
