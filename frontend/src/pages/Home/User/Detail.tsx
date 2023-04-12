import { useParams } from "react-router-dom";

function Detail() {
  const params = useParams();
  return <div>Detail of user - {params.uid}</div>;
}

export default Detail;
