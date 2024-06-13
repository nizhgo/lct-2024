import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { theme } from "src/assets/theme.ts";
import { Text } from "components/text.ts";
import { Stack } from "components/stack.ts";
import { Input } from "components/input";
import { CustomDropdown } from "components/dropdown.tsx";
import { Button } from "components/button.tsx";
import { PageHeader } from "components/pageHeader.tsx";
import { RequestsDto } from "api/models/requests.model.ts";
import { PassengerDto } from "api/models/passenger.model.ts";
import { RequestCreateViewModel } from "src/views/requests/form/request.form.vm.ts";

const PageLayout = styled.div`
  display: grid;
  grid-template-columns: 500px auto;
  grid-template-rows: 1fr;
  height: 100vh;

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const RequestCreatePage = observer(() => {
  const [vm] = useState(() => new RequestCreateViewModel());
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RequestsDto.RequestForm>({
    resolver: zodResolver(RequestsDto.RequestForm),
  });

  const onSubmit = async (data: RequestsDto.RequestForm) => {
    const isCreated = await vm.onSubmit(data);
    if (isCreated) {
      navigate("/requests");
    }
  };

  return (
    <Stack wFull hFull direction={"column"} gap={20}>
      <PageHeader>Создать заявку</PageHeader>
      <PageLayout>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            direction="column"
            gap={20}
            wFull
            style={{ maxWidth: "555px" }}
          >
            <Input
              label="Станция отправления"
              placeholder="Введите станцию отправления"
              error={errors.station_from?.message?.toString()}
              register={register("station_from")}
              required
            />
            <Input
              label="Станция прибытия"
              placeholder="Введите станцию прибытия"
              error={errors.station_to?.message?.toString()}
              register={register("station_to")}
              required
            />
            <Input
              label="Описание отправления"
              placeholder="Введите описание отправления"
              error={errors.description_from?.message?.toString()}
              register={register("description_from")}
            />
            <Input
              label="Описание прибытия"
              placeholder="Введите описание прибытия"
              error={errors.description_to?.message?.toString()}
              register={register("description_to")}
            />
            <Input
              label="Дата и время"
              placeholder="Введите дату и время"
              error={errors.datetime?.message?.toString()}
              register={register("datetime")}
              required
            />
            <Controller
              name="acceptation_method"
              control={control}
              render={({ field }) => (
                <CustomDropdown
                  label="Способ принятия"
                  options={RequestsDto.acceptationMethods}
                  onChange={field.onChange}
                  value={field.value as RequestsDto.AcceptationMethod}
                  defaultValue={["Не выбрано"]}
                  error={errors.acceptation_method?.message?.toString()}
                  required
                  render={(option) =>
                    RequestsDto.localizeAcceptationMethod(option)
                  }
                />
              )}
            />
            <Input.Number
              label="Количество пассажиров"
              placeholder="Введите количество пассажиров"
              error={errors.passengers_count?.message?.toString()}
              register={register("passengers_count", { valueAsNumber: true })}
              required
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
            <Input.Number
              label="Количество мужчин"
              placeholder="Введите количество мужчин"
              error={errors.male_users_count?.message?.toString()}
              register={register("male_users_count", { valueAsNumber: true })}
            />
            <Input.Number
              min={0}
              label="Количество женщин"
              placeholder="Введите количество женщин"
              error={errors.female_users_count?.message?.toString()}
              register={register("female_users_count", { valueAsNumber: true })}
            />
            <Input
              label="Дополнительная информация"
              placeholder="Введите дополнительную информацию"
              error={errors.additional_information?.message?.toString()}
              register={register("additional_information")}
            />
            <Input
              label="Тип багажа"
              placeholder="Введите тип багажа"
              error={errors.baggage_type?.message?.toString()}
              register={register("baggage_type")}
            />
            <Input.Number
              label="Вес багажа"
              placeholder="Введите вес багажа"
              error={errors.baggage_weight?.message?.toString()}
              register={register("baggage_weight", { valueAsNumber: true })}
            />
            <Stack direction="row" align="center" gap={10}>
              <input type="checkbox" {...register("baggage_help")} />
              <Text size={14}>Нужна помощь с багажом</Text>
            </Stack>
            <Button type="submit">Создать</Button>
          </Stack>
        </form>
      </PageLayout>
    </Stack>
  );
});

export default RequestCreatePage;
