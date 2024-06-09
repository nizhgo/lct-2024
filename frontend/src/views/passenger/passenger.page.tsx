import { useParams } from "react-router-dom";

const PassengerPage = () => {
  const { id } = useParams();
  return <div>passenger {id}</div>;
};

export default PassengerPage;
