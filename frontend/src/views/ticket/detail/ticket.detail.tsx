import { observer } from "mobx-react-lite";
import { Text } from "components/text.ts";
import { Stack } from "components/stack.ts";
import { Tooltip } from "components/tooltip.tsx";
import { useNavigate } from "react-router-dom";
import { Button } from "components/button.tsx";
import { RequestsDto } from "api/models/requests.model.ts";
import { useTheme } from "@emotion/react";
import { InternalLink } from "components/internalLink.tsx";
import PermissionsService from "src/stores/permissions.service.ts";
import { Link } from "react-router-dom";
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

const TicketDetails = observer(({ data }: { data: RequestsDto.Request }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleDistribute = () => {
    navigate(`/requests/${data.id}?distribute=1`);
  };
  return (
    <Stack direction={"column"} gap={20}>
      <Text size={24}>Распределение заявки</Text>
      {data.ticket ? (
        <>
          <Stack direction={"column"} gap={6}>
            <Text size={14}>{data.ticket.route.join(" → ")}</Text>
          </Stack>
          <Stack direction={"column"} gap={6}>
            <ParamName>Дата и время начала</ParamName>
            {data.datetime !== data.ticket.start_time ? (
              <Tooltip content="Время поездки было перенесено" action={"hover"}>
                <Text size={18} color={theme.colors.error}>
                  {new Date(data.ticket.start_time).toLocaleString()}
                </Text>
              </Tooltip>
            ) : (
              <Text size={18}>
                {new Date(data.ticket.start_time).toLocaleString()}
              </Text>
            )}
          </Stack>
          <Stack direction={"column"} gap={6}>
            <ParamName>Дата и время окончания</ParamName>
            <Text size={18}>
              {data.ticket.end_time
                ? new Date(data.ticket.end_time).toLocaleString()
                : "Не завершено"}
            </Text>
          </Stack>
          <Stack direction={"column"} gap={6}>
            <ParamName>Фактическое время окончания</ParamName>
            <Text size={18}>
              {data.ticket.real_end_time
                ? new Date(data.ticket.real_end_time).toLocaleString()
                : "Не завершено"}
            </Text>
          </Stack>
          <Stack direction={"column"} gap={6}>
            <ParamName>Дополнительная информация</ParamName>
            <Text size={18}>
              {data.ticket.additional_information || "Информация отсутствует"}
            </Text>
          </Stack>
          <Stack direction={"column"} gap={10}>
            <ParamName>Статус</ParamName>
            <Tab color={theme.colors.status.processed_auto}>
              <Text color={theme.colors.text}>{data.ticket.status}</Text>
            </Tab>
          </Stack>
          <Stack direction={"column"} gap={6}>
            <ParamName>Исполнители</ParamName>
            {data.ticket.users?.map((user, index) => (
              <InternalLink
                key={index}
                to={`/staff/${user.id}`}
                disabled={!PermissionsService.canRead("staff")}
              >
                <Text
                  key={user.id}
                  size={18}
                >{`${user.second_name} ${user.first_name} ${user.patronymic}`}</Text>
              </InternalLink>
            ))}
          </Stack>
          <Link to={`/requests/changelog/${data.ticket.id}`}>
            <Text size={18} style={{ textDecoration: "underline" }}>
              История изменений распределения заявки
            </Text>
          </Link>
        </>
      ) : (
        <>
          <Text color={"#787486"} size={16}>
            Заявка пока не распределена...
          </Text>
          <Button style={{ width: "fit-content" }} onClick={handleDistribute}>
            Распределить
          </Button>
        </>
      )}
    </Stack>
  );
});

export default TicketDetails;
