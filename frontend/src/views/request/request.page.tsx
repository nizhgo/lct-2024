import { useParams } from "react-router-dom";

const RequestPage = () => {
  const { id } = useParams();
  return <div>request {id}</div>;
};

export default RequestPage;
