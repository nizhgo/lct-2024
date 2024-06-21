import { observer } from "mobx-react-lite";
import { Stack } from "components/stack.ts";
import { Input } from "components/input.tsx";
import { Controller, useForm } from "react-hook-form";
import { CustomDropdown } from "components/dropdown.tsx";
import { TicketsDto } from "api/models/tickets.model.ts";
import { Button } from "components/button.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TicketCreateViewModel } from "src/views/ticket/form/ticket.form.vm.ts";
import { Text } from "components/text.ts";

const TicketForm = observer(() => {
  const [vm] = useState(() => new TicketCreateViewModel());
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<TicketsDto.TicketForm>({
    resolver: zodResolver(TicketsDto.TicketForm),
  });

  const onSubmit = async (data: TicketsDto.TicketForm) => {
    console.log("onSubmit", data);
    const isCreated = await vm.onSubmit(data);
    if (isCreated) {
      navigate(window.location.pathname);
    }
  };

  const onCancel = () => {
    navigate(window.location.pathname);
  };

  return (
    <Stack direction={"column"} gap={20}>
      <Text size={24}>Распределение заявки</Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="column" gap={20} wFull style={{ maxWidth: "555px" }}>
          <Input
            label="Дата и время начала"
            type={"datetime-local"}
            placeholder="Введите дату и время"
            error={errors.start_time?.message?.toString()}
            register={register("start_time")}
            required
          />
          <Input
            label="Дата и время окончания"
            type={"datetime-local"}
            placeholder="Введите дату и время"
            error={errors.end_time?.message?.toString()}
            register={register("end_time")}
            required
          />
          <Input
            label="Фактическое время окончания"
            type={"datetime-local"}
            placeholder="Введите дату и время"
            error={errors.real_end_time?.message?.toString()}
            register={register("real_end_time")}
          />
          <Input
            label="Дополнительная информация"
            placeholder="Введите дополнительную информацию"
            error={errors.additional_information?.message?.toString()}
            register={register("additional_information")}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <CustomDropdown
                label="Статус"
                options={TicketsDto.ticketStatus}
                onChange={field.onChange}
                value={"Принята"}
                error={errors.status?.message?.toString()}
                required
                render={(option) => option}
              />
            )}
          />
          <Stack gap={20}>
            <Button type="submit">Сохранить</Button>
            <Button type="button" onClick={onCancel} variant={"black"}>
              Отменить
            </Button>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
});

export default TicketForm;
