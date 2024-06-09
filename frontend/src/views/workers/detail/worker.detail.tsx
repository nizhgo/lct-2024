import { useParams } from "react-router-dom";
import { Text } from "components/text.ts";

export const WorkerDetail = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <Text size={32}>Детальная информация о сотруднике {id}</Text>
    </div>
  );
};
