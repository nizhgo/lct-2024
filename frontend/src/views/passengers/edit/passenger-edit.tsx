import { PageHeader } from "components/pageHeader.tsx";
import { Stack } from "components/stack.ts";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PassengerEndpoint } from "api/endpoints/passenger.endpoint.ts";
import { Loader, LoaderWrapper } from "src/loader.tsx";
import { Input } from "components/input.tsx";
import { CustomDropdown } from "components/dropdown.tsx";
import { Text } from "components/text.ts";
import { Button } from "components/button.tsx";
import { PassengerDto } from "api/models/passenger.model.ts";

export const PassengerEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<PassengerDto.Passenger | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      return;
    }
    PassengerEndpoint.findById(id).then((passenger) => {
      // passenger.patronymic = passenger.name.split(" ")[2];
      // passenger.second_name = passenger.name.split(" ")[1];
      // passenger.name = passenger.name.split(" ")[0];
      setData(passenger);
      console.log(passenger);
      setLoading(false);
    });
  }, []);

  if (loading && !data) {
    return (
      <LoaderWrapper height={"100%"}>
        <Loader />
      </LoaderWrapper>
    );
  }

  if (!data) {
    return <Text>Пассажир не найден</Text>;
  }
  return loading ? (
    <LoaderWrapper height={"100%"}>
      <Loader />
    </LoaderWrapper>
  ) : (
    <Stack direction={"column"} gap={14} wFull style={{ maxWidth: "555px" }}>
      <PageHeader style={{ marginBottom: 16 }}>Пассажир #{id}</PageHeader>
      <Input defaultValue={data.name} label={"ФИО"} />
      <CustomDropdown
        label={"Пол"}
        options={["Мужской", "Женский"]}
        value={data.sex === "male" ? "Мужской" : "Женский"}
        onChange={() => {}}
      />
      <Input placeholder={"Номер телефона"} label={"Номер телефона"} />
      <CustomDropdown
        label={"Категория"}
        options={[
          "ИЗТ",
          "ИЗ",
          "ИС",
          "ИК",
          "ИО",
          "ДИ",
          "ПЛ",
          "РД",
          "РДК",
          "ОГД",
          "ОВ",
          "ИУ",
        ]}
        onChange={() => {}}
        value={data.category}
      />
      <Stack direction={"row"} align={"center"} gap={10}>
        {/*//TODO: add checkbox component*/}
        <input type="checkbox" />
        <Text size={14}>Имеется электрокардио стимулятор</Text>
      </Stack>
      <Stack direction={"column"} gap={10}>
        {/*//TODO: add textarea component*/}
        <label htmlFor={"Комментарий"}>Комментарий</label>
        <textarea
          id="Комментарий"
          name="Комментарий"
          aria-rowcount={5}
          aria-colcount={33}
          defaultValue={data.additional_information}
        />
      </Stack>
      <Stack gap={20}>
        <Button type="submit">Сохранить</Button>
        <Button variant={"black"}>Удалить</Button>
      </Stack>
    </Stack>
  );
};
