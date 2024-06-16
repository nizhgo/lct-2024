import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { Text } from "components/text.ts";
import { Stack } from "components/stack.ts";
import { Input } from "components/input";
import {
  CustomDropdown,
  SearchableInfiniteDropdown,
} from "components/dropdown.tsx";
import { Button } from "components/button.tsx";
import { PageHeader } from "components/pageHeader.tsx";
import { RequestsDto } from "api/models/requests.model.ts";
import { PassengerDto } from "api/models/passenger.model.ts";
import { RequestCreateViewModel } from "src/views/requests/form/request.form.vm.ts";
import { findLineIconByName } from "src/assets/metro.tsx";
import topArrow from "src/assets/icons/arrow_up_md.svg";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 64px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const GridItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
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
      <GridContainer>
        <GridItem>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack
              direction="column"
              gap={20}
              wFull
              style={{ maxWidth: "555px" }}
            >
              <Controller
                name="passenger_id"
                control={control}
                render={({ field }) => (
                  <SearchableInfiniteDropdown
                    label="Пассажир"
                    provider={vm.passengerProvider}
                    onChange={(option) => field.onChange(Number(option.id))}
                    searchField="name"
                    error={errors.station_from_id?.message?.toString()}
                    required
                    render={(option) => option.name}
                  />
                )}
              />
              <Controller
                name="station_from_id"
                control={control}
                render={({ field }) => (
                  <SearchableInfiniteDropdown
                    label="Станция отправления"
                    provider={vm.stationProvider}
                    onChange={(option) => field.onChange(Number(option.id))}
                    searchField="name_station"
                    error={errors.station_from_id?.message?.toString()}
                    required
                    render={(option) => (
                      <Stack direction={"row"} gap={5} align={"center"}>
                        {findLineIconByName(option.name_line)}
                        {option.name_station}
                      </Stack>
                    )}
                  />
                )}
              />
              <Controller
                name="station_to_id"
                control={control}
                render={({ field }) => (
                  <SearchableInfiniteDropdown
                    label="Станция прибытия"
                    provider={vm.stationProvider}
                    onChange={(option) => field.onChange(Number(option.id))}
                    searchField="name_station"
                    error={errors.station_from_id?.message?.toString()}
                    required
                    render={(option) => (
                      <Stack direction={"row"} gap={5} align={"center"}>
                        {findLineIconByName(option.name_line)}
                        {option.name_station}
                      </Stack>
                    )}
                  />
                )}
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
                type={"datetime-local"}
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
                    label="Способ получения заявки"
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
        </GridItem>
        <GridItem>
          <Text size={24}>Загрузить аудиофрагмент</Text>
          <form>
            <Stack gap={20}>
              <label
                htmlFor="file-upload"
                style={{
                  border: "1px solid #ccc",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "11px 12px",
                  cursor: "pointer",
                  width: "170px",
                  borderRadius: "4px",
                }}
              >
                Загрузить файл
                <img src={topArrow} alt="" style={{ width: "22px" }} />
              </label>
              <input id="file-upload" type="file" style={{ display: "none" }} />
              <Button type={"submit"}>Обработать</Button>
            </Stack>
          </form>
        </GridItem>
      </GridContainer>
    </Stack>
  );
});

export default RequestCreatePage;
