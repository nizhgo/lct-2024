import { PageHeader } from "components/pageHeader.tsx";
import { Stack } from "components/stack.ts";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Text } from "components/text.ts";
import { Loader, LoaderWrapper } from "src/loader.tsx";
import { BackButton, Button } from "components/button.tsx";
import { observer } from "mobx-react-lite";
import styled from "@emotion/styled";
import { theme } from "src/assets/theme.ts";
import { StaffDetailsViewModel } from "src/views/staff/detail/staff.detail.vm.ts";
import { Svg } from "components/svg.tsx";
import BackArrowIcon from "src/assets/icons/arrow_undo_up_left.svg";
import { Input } from "components/input.tsx";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GapsDto } from "api/models/gaps.model.ts";
import { CustomDropdown } from "components/dropdown.tsx";

const ParamName = (x: { children: React.ReactNode }) => {
  return <Text color={"#787486"}>{x.children}</Text>;
};

const Tab = (x: { color: string; children: React.ReactNode }) => {
  return (
    <div
      style={{
        backgroundColor: x.color,
        width: "fit-content",
        padding: "5px 10px",
        borderRadius: 20,
      }}
    >
      {x.children}
    </div>
  );
};

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

const StaffDetails = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vm] = useState(() => new StaffDetailsViewModel(id!));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<GapsDto.Gap>({
    resolver: zodResolver(GapsDto.Gap),
  });
  useEffect(() => {
    vm.loadStaff();
  }, [vm]);

  const handleEdit = () => {
    navigate(`/staff/${id}/edit`);
  };
  const onOpenModal = () => {
    setIsModalOpen((isModalOpen) => !isModalOpen);
  };

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
    <>
      <BackButton onClick={() => navigate(-1)}>
        <Stack align={"center"} gap={6}>
          <Svg src={BackArrowIcon} width={20} color={"black"} />
          <Text size={16}>Назад</Text>
        </Stack>
      </BackButton>
      <Stack direction={"column"} gap={30}>
        <PageHeader>Сотрудник #{id}</PageHeader>
        <GridContainer>
          <GridItem>
            <ResponsiveStack>
              <Stack direction={"column"} gap={20}>
                <Text size={24}>Данные сотрудника</Text>
                <Stack direction={"column"} gap={6}>
                  <ParamName>ФИО</ParamName>
                  <Text size={18}>
                    {vm.data.second_name} {vm.data.first_name} {vm.data.patronymic}
                  </Text>
                </Stack>
                <Stack direction={"column"} gap={6}>
                  <ParamName>Пол</ParamName>
                  <Text size={18}>
                    {vm.data.sex === "male" ? "Мужской" : "Женский"}
                  </Text>
                </Stack>
                <Stack direction={"column"} gap={6}>
                  <ParamName>Раб. номер телефона</ParamName>
                  <Text size={18}>{vm.data.work_phone}</Text>
                </Stack>
                <Stack direction={"column"} gap={6}>
                  <ParamName>Личн. номер телефона</ParamName>
                  <Text size={18}>{vm.data.personal_phone}</Text>
                </Stack>
                <Stack direction={"column"} gap={10}>
                  <ParamName>Должность</ParamName>
                  <Tab color={"#FFCED1"}>
                    <Text color={"#D9232E"}>{vm.data.rank}</Text>
                  </Tab>
                </Stack>
                <Stack direction={"column"} gap={10}>
                  <ParamName>Только легкий труд?</ParamName>
                  {vm.data.is_lite ? (
                    <Tab color={"#FFCED1"}>
                      <Text color={"#D9232E"}>Да</Text>
                    </Tab>
                  ) : (
                    <Tab color={"#16C09838"}>
                      <Text color={"#008767"}>Нет</Text>
                    </Tab>
                  )}
                </Stack>
                <Button style={{ width: "fit-content" }} onClick={handleEdit}>
                  Редактировать
                </Button>
              </Stack>
            </ResponsiveStack>
          </GridItem>
          <GridItem>
            <Text size={24}>Расписание сотрудника</Text>
            <Button type={"button"} onClick={onOpenModal}>Добавить событие</Button>
            <div
              style={{
                position: "absolute",
                height: "100vh",
                width: "100vw",
                top: "0",
                left: "0",
                backgroundColor: "rgba(0,0,0,0.4)",
                display: isModalOpen ? "flex" : "none",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "60vw",
                  margin: "auto",
                  backgroundColor: "#fff",
                  padding: "20px",
                }}
              >
                <Stack direction={"column"} gap={20}>
                  <Text size={24}>Добавление события</Text>
                  <form onSubmit={handleSubmit}>
                    <Stack direction={"column"} gap={20}>
                      <Input
                        label="Дата начала"
                        type={"datetime-local"}
                        placeholder="Введите дату и время"
                        error={errors.start_time?.message?.toString()}
                        register={register("start_time")}
                        required
                      />
                      <Input
                        label="Дата окончания"
                        type={"datetime-local"}
                        placeholder="Введите дату и время"
                        error={errors.end_time?.message?.toString()}
                        register={register("end_time")}
                        required
                      />
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <CustomDropdown
                            label="Категория"
                            options={GapsDto.statusValues}
                            // disabledOptions={["Не выбрано" as GapsDto.statusValues]} //cringe
                            onChange={field.onChange}
                            value={field.value as GapsDto.Status}
                            error={errors.status?.message?.toString()}
                            required
                            // render={ option }
                          />
                        )}
                      />
                      <Stack direction={"column"} gap={10}>
                        <label htmlFor={"description"}>Комментарий</label>
                        <TextArea
                          id="description"
                          {...register("description")}
                          aria-rowcount={5}
                          aria-colcount={33}
                          placeholder="Введите дополнительную информацию"
                        />
                      </Stack>
                      <Button type={"submit"}>Отправить</Button>
                    </Stack>
                  </form>
                </Stack>
                <Button
                  onClick={onOpenModal}
                  variant={"black"}
                  style={{ position: "absolute", right: "10px", top: "10px" }}
                >
                  close
                </Button>
              </div>
            </div>
          </GridItem>
        </GridContainer>
      </Stack>
    </>
  );
});

const ResponsiveStack = styled(Stack)`
  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 20px;
  }
`;

export default StaffDetails;
