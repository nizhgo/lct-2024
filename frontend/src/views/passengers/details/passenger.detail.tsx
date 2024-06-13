import { PageHeader } from "components/pageHeader.tsx";
import { Stack } from "components/stack.ts";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Text } from "components/text.ts";
import { PassengerEndpoint } from "api/endpoints/passenger.endpoint.ts";
import { useEffect } from "react";
import { Loader, LoaderWrapper } from "src/loader.tsx";
import { Button } from "components/button.tsx";
import { PassengerDto } from "api/models/passenger.model.ts";

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

export const PassengerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<PassengerDto.Passenger | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const handleEdit = () => {
    navigate(`/passengers/edit/${id}`);
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    PassengerEndpoint.findById(id).then((passenger) => {
      setData(passenger);
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
  return (
    <Stack direction={"column"} gap={30}>
      <PageHeader>Пассажир #{id}</PageHeader>
      <Stack gap={200}>
        <Stack direction={"column"} gap={20}>
          <Text size={24}>Данные пассажира</Text>
          <Stack direction={"column"} gap={6}>
            <ParamName>ФИО</ParamName>
            <Text size={18}>{data.name}</Text>
          </Stack>
          <Stack direction={"column"} gap={6}>
            <ParamName>Пол</ParamName>
            <Text size={18}>{data.sex === "male" ? "Мужской" : "Женский"}</Text>
          </Stack>
          <Stack direction={"column"} gap={6}>
            <ParamName>Номер телефона</ParamName>
            <Text size={18}>{`+${data.contact_details.slice(0, 1)} 
            (${data.contact_details.slice(1, 4)}) ${data.contact_details.slice(4, 7)}-${data.contact_details.slice(7, 9)}-${data.contact_details.slice(9, 11)}`}</Text>
          </Stack>
          <Stack direction={"column"} gap={10}>
            <ParamName>Категория</ParamName>
            <Tab color={"#FFCED1"}>
              <Text color={"#D9232E"}>{data.category}</Text>
            </Tab>
          </Stack>
          <Stack direction={"column"} gap={10}>
            <ParamName>Имется электрокардио стимулятор?</ParamName>
            {data.has_cardiac_pacemaker ? (
              <Tab color={"#FFCED1"}>
                <Text color={"#D9232E"}>Кардио стим.</Text>
              </Tab>
            ) : (
              <Tab color={"#16C09838"}>
                <Text color={"#008767"}>Отсутсвует</Text>
              </Tab>
            )}
          </Stack>
          <Stack direction={"column"} gap={6}>
            <ParamName>Комментарий</ParamName>
            <Text size={18}>
              {data.additional_information || "Комментарий отсутствует"}
            </Text>
          </Stack>
          <Button style={{ width: "fit-content" }} onClick={handleEdit}>
            Редактировать
          </Button>
        </Stack>
        <Text size={24}>Заявки</Text>
        {/*<ResponsiveTable*/}
        {/*  columns={columns}*/}
        {/*  data={vm.passengers}*/}
        {/*  renderRow={renderRow}*/}
        {/*/>*/}
      </Stack>
    </Stack>
  );
};
