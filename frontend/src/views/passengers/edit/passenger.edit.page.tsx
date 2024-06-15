import { PageHeader } from "components/pageHeader.tsx";
import { Stack } from "components/stack.ts";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loader, LoaderWrapper } from "src/loader.tsx";
import { Input } from "components/input.tsx";
import { CustomDropdown } from "components/dropdown.tsx";
import { Text } from "components/text.ts";
import { Button } from "components/button.tsx";
import { PassengerDto } from "api/models/passenger.model.ts";
import { PassengerEditViewModel } from "src/views/passengers/edit/passenger.edit.vm.ts";
import { Controller, useForm } from "react-hook-form";
import { UsersDto } from "api/models/users.model.ts";
import styled from "@emotion/styled";
import { theme } from "src/assets/theme.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { observer } from "mobx-react-lite";
import { NotFoundPage } from "src/views/404/notFound.page.tsx";
import { Svg } from "components/svg.tsx";
import BackArrowIcon from "src/assets/icons/arrow_undo_up_left.svg";

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

export const PassengerEditPage = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [vm] = useState(() => new PassengerEditViewModel(id!));

  useEffect(() => {
    vm.loadPassenger();
  }, [vm]);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<PassengerDto.PassengerForm>({
    resolver: zodResolver(PassengerDto.PassengerForm),
  });

  useEffect(() => {
    if (vm.data) {
      reset(vm.data);
    }
  }, [vm.data, reset]);

  const onSubmit = async (data: PassengerDto.PassengerForm) => {
    console.log("onSubmit", data);
    const isRegistered = await vm.onSubmit(data);
    if (isRegistered) {
      navigate(`/passengers/${id}`);
    }
  };
  const onDelete = async () => {
    const isRegistered = await vm.onDelete();
    if (isRegistered) {
      navigate("/passengers");
    }
  };

  if (!id) {
    return <Text>Пассажир не найден</Text>;
  }

  if (vm.loading && !vm.data) {
    return (
      <LoaderWrapper height={"100%"}>
        <Loader />
      </LoaderWrapper>
    );
  }

  if (!vm.data) {
    return <NotFoundPage />;
  }

  return (
    <>
      <Link to={`/passengers/${id}`}>
        <Stack align={"center"} gap={6}>
          <Svg src={BackArrowIcon} width={20} color={"black"} />
          <Text size={16}>К информации пассажира</Text>
        </Stack>
      </Link>
      <Stack direction={"column"} gap={14} wFull style={{ maxWidth: "555px" }}>
        <PageHeader style={{ marginBottom: 16 }}>Пассажир #{id}</PageHeader>
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
              <Stack gap={20}>
                <Button type={"submit"}>Сохранить</Button>
                <Button type={"button"} variant={"black"} onClick={onDelete}>
                  Удалить
                </Button>
              </Stack>
            </Stack>
          </form>
        </PageLayout>
      </Stack>
    </>
  );
});
