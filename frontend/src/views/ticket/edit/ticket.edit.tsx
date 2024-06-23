// import { observer } from "mobx-react-lite";
// import { Stack } from "components/stack.ts";
// import { Input } from "components/input.tsx";
// import { useFormReturn, Controller } from "react-hook-form";
// import { CustomDropdown } from "components/dropdown.tsx";
// import { TicketsDto } from "api/models/tickets.model.ts";
// import { Button } from "components/button.tsx";
//
// const TicketEdit = observer(
//   ({ ticketForm }: { ticketForm: useFormReturn<TicketsDto.TicketForm> }) => {
//     return (
//       <form onSubmit={ticketForm.handleSubmit(onTicketSubmit)}>
//         <Stack direction="column" gap={20} wFull style={{ maxWidth: "555px" }}>
//           <Input
//             label="Дата и время начала"
//             type={"datetime-local"}
//             placeholder="Введите дату и время"
//             error={ticketForm.formState.errors.start_time?.message?.toString()}
//             register={ticketForm.register("start_time")}
//             required
//           />
//           <Input
//             label="Дата и время окончания"
//             type={"datetime-local"}
//             placeholder="Введите дату и время"
//             error={ticketForm.formState.errors.end_time?.message?.toString()}
//             register={ticketForm.register("end_time")}
//             required
//           />
//           <Input
//             label="Фактическое время окончания"
//             type={"datetime-local"}
//             placeholder="Введите дату и время"
//             error={ticketForm.formState.errors.real_end_time?.message?.toString()}
//             register={ticketForm.register("real_end_time")}
//             required
//           />
//           <Input
//             label="Дополнительная информация"
//             placeholder="Введите дополнительную информацию"
//             error={ticketForm.formState.errors.additional_information?.message?.toString()}
//             register={ticketForm.register("additional_information")}
//           />
//           <Controller
//             name="status"
//             control={ticketForm.control}
//             render={({field}) => (
//               <CustomDropdown
//                 label="Статус"
//                 options={TicketsDto.ticketStatus}
//                 onChange={field.onChange}
//                 value={field.value}
//                 error={ticketForm.formState.errors.status?.message?.toString()}
//                 required
//                 render={(option) => option}
//               />
//             )}
//           />
//           <Button type="submit">Сохранить</Button>
//         </Stack>
//       </form>
//     );
// });
//
// export default TicketEdit;
