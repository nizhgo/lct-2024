import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styled from "@emotion/styled";
import { Text } from "components/text.ts";
import { Stack } from "components/stack.ts";
import { Input } from "components/input";
import {
  CustomDropdown,
  SearchableInfiniteDropdown,
} from "components/dropdown.tsx";
import { BackButton, Button } from "components/button.tsx";
import { PageHeader } from "components/pageHeader.tsx";
import { RequestsDto } from "api/models/requests.model.ts";
import { PassengerDto } from "api/models/passenger.model.ts";
import { findLineIconByName } from "src/assets/metro.tsx";
import { RequestEditViewModel } from "src/views/requests/edit/request.edit.vm.ts";
import { Svg } from "components/svg.tsx";
import BackArrowIcon from "src/assets/icons/arrow_undo_up_left.svg";
import { TicketsDto } from "api/models/tickets.model.ts";
import TicketForm from "src/views/ticket/form/ticket.form.tsx";

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

const RequestEditPage = observer(() => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const distribute = Boolean(searchParams.get("distribute"));
  const [vm] = useState(() => new RequestEditViewModel(id!));
  const navigate = useNavigate();

  useEffect(() => {
    vm.loadRequest().then(() => console.log(vm.data));
  }, [vm]);

  const requestForm = useForm<RequestsDto.RequestForm>({
    resolver: zodResolver(RequestsDto.RequestForm),
  });

  const ticketForm = useForm<TicketsDto.TicketForm>({
    resolver: zodResolver(TicketsDto.TicketForm),
  });

  useEffect(() => {
    if (vm.data) {
      requestForm.reset(vm.data);
      if (vm.data.ticket) {
        ticketForm.reset(TicketsDto.convertTicketShortToForm(vm.data.ticket));
      }
    }
  }, [vm.data, requestForm.reset, ticketForm.reset]);

  const onSubmit = async (data: RequestsDto.RequestForm) => {
    console.log("onSubmit", data);
    const isRegistered = await vm.onSubmit(data);
    if (isRegistered) {
      navigate(`/requests/${id}`);
    }
  };

  const onTicketSubmit = async (data: TicketsDto.TicketForm) => {
    console.log("onSubmit", data);
    if (vm.data && vm.data.ticket) {
      const isRegistered = await vm.onTicketSubmit(
        String(vm.data.ticket.id),
        data,
      );
      if (isRegistered) {
        navigate(`/requests/${id}`);
      }
    }
  };

  const handleDistribute = () => {
    navigate(`/requests/edit/${id}?distribute=1`);
  };

  return (
    <Stack wFull hFull direction={"column"} gap={20}>
      <BackButton onClick={() => navigate(-1)}>
        <Stack align={"center"} gap={6}>
          <Svg src={BackArrowIcon} width={20} color={"black"} />
          <Text size={16}>Назад</Text>
        </Stack>
      </BackButton>
      <PageHeader>Заявка #{id}</PageHeader>
      <GridContainer>
        <GridItem>
          <Text size={24}>Данные заявки</Text>
          <form onSubmit={requestForm.handleSubmit(onSubmit)}>
            <Stack
              direction="column"
              gap={20}
              wFull
              style={{ maxWidth: "555px" }}
            >
              <Controller
                name="passenger_id"
                control={requestForm.control}
                render={({ field }) => (
                  <SearchableInfiniteDropdown
                    label="Пассажир"
                    value={vm.data?.passenger}
                    provider={vm.passengerProvider}
                    onChange={(option) => field.onChange(Number(option.id))}
                    searchField="name"
                    error={requestForm.formState.errors.station_from_id?.message?.toString()}
                    required
                    render={(option) => option.name}
                  />
                )}
              />
              <Controller
                name="station_from_id"
                control={requestForm.control}
                render={({ field }) => (
                  <SearchableInfiniteDropdown
                    label="Станция отправления"
                    provider={vm.stationProvider}
                    value={vm.data?.station_from}
                    onChange={(option) => field.onChange(Number(option.id))}
                    searchField="name_station"
                    error={requestForm.formState.errors.station_from_id?.message?.toString()}
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
                control={requestForm.control}
                render={({ field }) => (
                  <SearchableInfiniteDropdown
                    label="Станция прибытия"
                    provider={vm.stationProvider}
                    value={vm.data?.station_to}
                    onChange={(option) => field.onChange(Number(option.id))}
                    searchField="name_station"
                    error={requestForm.formState.errors.station_from_id?.message?.toString()}
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
                error={requestForm.formState.errors.description_from?.message?.toString()}
                register={requestForm.register("description_from")}
              />
              <Input
                label="Описание прибытия"
                placeholder="Введите описание прибытия"
                error={requestForm.formState.errors.description_to?.message?.toString()}
                register={requestForm.register("description_to")}
              />
              <Input
                label="Дата и время"
                type={"datetime-local"}
                placeholder="Введите дату и время"
                error={requestForm.formState.errors.datetime?.message?.toString()}
                register={requestForm.register("datetime")}
                required
              />
              <Controller
                name="acceptation_method"
                control={requestForm.control}
                render={({ field }) => (
                  <CustomDropdown
                    label="Способ получения заявки"
                    options={RequestsDto.acceptationMethods}
                    onChange={field.onChange}
                    value={field.value as RequestsDto.AcceptationMethod}
                    defaultValue={["Не выбрано"]}
                    error={requestForm.formState.errors.acceptation_method?.message?.toString()}
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
                error={requestForm.formState.errors.passengers_count?.message?.toString()}
                register={requestForm.register("passengers_count", {
                  valueAsNumber: true,
                })}
                required
              />
              <Controller
                name="category"
                control={requestForm.control}
                render={({ field }) => (
                  <CustomDropdown
                    label="Категория"
                    options={PassengerDto.passengerCategoryValues}
                    onChange={field.onChange}
                    value={field.value}
                    error={requestForm.formState.errors.category?.message?.toString()}
                    required
                    render={(option) => option}
                  />
                )}
              />
              <Input.Number
                label="Количество мужчин"
                placeholder="Введите количество мужчин"
                error={requestForm.formState.errors.male_users_count?.message?.toString()}
                register={requestForm.register("male_users_count", {
                  valueAsNumber: true,
                })}
              />
              <Input.Number
                min={0}
                label="Количество женщин"
                placeholder="Введите количество женщин"
                error={requestForm.formState.errors.female_users_count?.message?.toString()}
                register={requestForm.register("female_users_count", {
                  valueAsNumber: true,
                })}
              />
              <Input
                label="Дополнительная информация"
                placeholder="Введите дополнительную информацию"
                error={requestForm.formState.errors.additional_information?.message?.toString()}
                register={requestForm.register("additional_information")}
              />
              <Input
                label="Тип багажа"
                placeholder="Введите тип багажа"
                error={requestForm.formState.errors.baggage_type?.message?.toString()}
                register={requestForm.register("baggage_type")}
              />
              <Input.Number
                label="Вес багажа"
                placeholder="Введите вес багажа"
                error={requestForm.formState.errors.baggage_weight?.message?.toString()}
                register={requestForm.register("baggage_weight", {
                  valueAsNumber: true,
                })}
              />
              <Stack direction="row" align="center" gap={10}>
                <input
                  type="checkbox"
                  {...requestForm.register("baggage_help")}
                />
                <Text size={14}>Нужна помощь с багажом</Text>
              </Stack>
              <Button type="submit">Сохранить</Button>
            </Stack>
          </form>
        </GridItem>
        <GridItem>
          {vm.data?.ticket ? (
            <form onSubmit={ticketForm.handleSubmit(onTicketSubmit)}>
              <Stack
                direction="column"
                gap={20}
                wFull
                style={{ maxWidth: "555px" }}
              >
                <Input
                  label="Дата и время начала"
                  type={"datetime-local"}
                  placeholder="Введите дату и время"
                  error={ticketForm.formState.errors.start_time?.message?.toString()}
                  register={ticketForm.register("start_time")}
                  required
                />
                <Input
                  label="Дата и время окончания"
                  type={"datetime-local"}
                  placeholder="Введите дату и время"
                  error={ticketForm.formState.errors.end_time?.message?.toString()}
                  register={ticketForm.register("end_time")}
                  required
                />
                <Input
                  label="Фактическое время окончания"
                  type={"datetime-local"}
                  placeholder="Введите дату и время"
                  error={ticketForm.formState.errors.real_end_time?.message?.toString()}
                  register={ticketForm.register("real_end_time")}
                  required
                />
                <Input
                  label="Дополнительная информация"
                  placeholder="Введите дополнительную информацию"
                  error={ticketForm.formState.errors.additional_information?.message?.toString()}
                  register={ticketForm.register("additional_information")}
                />
                <Controller
                  name="status"
                  control={ticketForm.control}
                  render={({ field }) => (
                    <CustomDropdown
                      label="Статус"
                      options={TicketsDto.ticketStatus}
                      onChange={field.onChange}
                      value={field.value}
                      error={ticketForm.formState.errors.status?.message?.toString()}
                      required
                      render={(option) => option}
                    />
                  )}
                />
                <Button type="submit">Сохранить</Button>
              </Stack>
            </form>
          ) : distribute ? (
            <TicketForm />
          ) : (
            <>
              <Text size={24}>Распределение заявки</Text>
              <Text color={"#787486"} size={16}>
                Заявка пока не распределена...
              </Text>
              <Button
                type={"button"}
                style={{ width: "fit-content" }}
                onClick={handleDistribute}
              >
                Распределить
              </Button>
            </>
          )}
        </GridItem>
      </GridContainer>
    </Stack>
  );
});

export default RequestEditPage;
