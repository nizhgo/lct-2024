import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChangeLogPageViewModel } from "src/views/changelog/changelog.vm.ts";
import { Stack } from "components/stack.ts";
import { PageHeader } from "components/pageHeader.tsx";
import { Loader, LoaderWrapper } from "src/loader.tsx";
import { Text } from "components/text.ts";
import { observer } from "mobx-react-lite";
import { Svg } from "components/svg.tsx";
import BackArrowIcon from "src/assets/icons/arrow_undo_up_left.svg";
import { BackButton } from "components/button.tsx";
import { theme } from "src/assets/theme.ts";
import arrowLeft from "src/assets/icons/arrow-left.svg";

const ChangelogPage = observer(() => {
  const { id } = useParams<{ id: string }>();
  const [vm] = useState(() => new ChangeLogPageViewModel(id!));
  const navigate = useNavigate();

  useEffect(() => {
    vm.loadHistory().then((data) => console.log(data));
  }, [vm]);

  if (vm.loading && !vm.data) {
    return (
      <LoaderWrapper height={"100%"}>
        <Loader />
      </LoaderWrapper>
    );
  }

  if (!vm.data) {
    return <Text>Заявка не найдена</Text>;
  }
  return (
    <Stack direction={"column"} gap={30}>
      <BackButton onClick={() => navigate(-1)}>
        <Stack align={"center"} gap={6}>
          <Svg src={BackArrowIcon} width={20} color={"black"} />
          <Text size={16}>Назад</Text>
        </Stack>
      </BackButton>
      <PageHeader>Изменения распределения заявки #{id}</PageHeader>
      <Stack $wrap={"wrap"} gap={30} align={"center"}>
        {vm.data.map((item, i) => {
          if (vm.data) {
            if (i === vm.data.length - 1) {
              return (
                <Stack
                  key={i}
                  direction={"column"}
                  style={{
                    border: `1px solid ${theme.colors.status.completed}`,
                    borderRadius: "6px",
                    padding: "20px",
                  }}
                  gap={20}
                >
                  <Stack direction={"column"} gap={10}>
                    <Text size={16} color={theme.colors.status.completed}>
                      ID распределения
                    </Text>
                    <Text>#{item.ticket_id}</Text>
                  </Stack>
                  <Stack direction={"column"} gap={10}>
                    <Text size={16} color={theme.colors.status.completed}>
                      Статус
                    </Text>
                    <Text>{item.status}</Text>
                  </Stack>
                  <Stack direction={"column"} gap={10}>
                    <Text size={16} color={theme.colors.status.completed}>
                      Время начала
                    </Text>
                    <Text>{item.start_time}</Text>
                  </Stack>
                  <Stack direction={"column"} gap={10}>
                    <Text size={16} color={theme.colors.status.completed}>
                      Время окончания
                    </Text>
                    <Text>{item.end_time}</Text>
                  </Stack>
                  <Stack direction={"column"} gap={10}>
                    <Text size={16} color={"#787486"}>
                      Автор редактирования
                    </Text>
                    <Text>
                      {item.author.first_name} {item.author.second_name}{" "}
                      {item.author.patronymic}
                    </Text>
                  </Stack>
                  <Stack direction={"column"} gap={10}>
                    <Text size={16} color={"#787486"}>
                      Время редактирования
                    </Text>
                    <Text>{item.change_date}</Text>
                  </Stack>
                </Stack>
              );
            } else {
              return (
                <>
                  <Stack
                    key={i}
                    direction={"column"}
                    style={{
                      border: `1px solid ${theme.colors.status.new}`,
                      borderRadius: "6px",
                      padding: "20px",
                    }}
                    gap={20}
                  >
                    <Stack direction={"column"} gap={10}>
                      <Text size={16} color={theme.colors.status.completed}>
                        ID распределения
                      </Text>
                      <Text>#{item.ticket_id}</Text>
                    </Stack>
                    <Stack direction={"column"} gap={10}>
                      <Text size={16} color={theme.colors.status.new}>
                        Статус
                      </Text>
                      <Text>{item.status}</Text>
                    </Stack>
                    <Stack direction={"column"} gap={10}>
                      <Text size={16} color={theme.colors.status.new}>
                        Время начала
                      </Text>
                      <Text>{item.start_time}</Text>
                    </Stack>
                    <Stack direction={"column"} gap={10}>
                      <Text size={16} color={theme.colors.status.new}>
                        Время окончания
                      </Text>
                      <Text>{item.end_time}</Text>
                    </Stack>
                    <Stack direction={"column"} gap={10}>
                      <Text size={16} color={"#787486"}>
                        Автор редактирования
                      </Text>
                      <Text>
                        {item.author.first_name} {item.author.second_name}{" "}
                        {item.author.patronymic}
                      </Text>
                    </Stack>
                  </Stack>
                  <img src={arrowLeft} alt="" />
                </>
              );
            }
          }
        })}
      </Stack>
    </Stack>
  );
});

export default ChangelogPage;
