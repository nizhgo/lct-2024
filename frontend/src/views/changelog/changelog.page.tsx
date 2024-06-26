import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChangeLogPageViewModel } from "src/views/changelog/changelog.vm.ts";
import { Stack } from "components/stack.ts";
import { PageHeader } from "components/pageHeader.tsx";
import { Loader, LoaderWrapper } from "src/loader.tsx";
import { Text } from "components/text.ts";

const ChangelogPage = () => {
  const { id } = useParams<{ id: string }>();
  const [vm] = useState(() => new ChangeLogPageViewModel(id!));

  useEffect(() => {
    vm.loadHistory().then(data => console.log(data));
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
    <Stack direction={"column"}>
      <PageHeader>Изменения распределения заявки #{id}</PageHeader>
      <Stack $wrap={"wrap"}>
        {vm.data.map((item, i) => (
          <Stack key={i} direction={"column"}>
            {item.status}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default ChangelogPage;
