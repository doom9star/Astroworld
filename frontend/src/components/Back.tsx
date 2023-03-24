import { useNavigate } from "react-router-dom";

function Back() {
  const navigate = useNavigate();
  return (
    <div
      className="border cursor-pointer px-2 py-1 text-xs mx-10"
      onClick={() => navigate(-1)}
    >
      {">"}
    </div>
  );
}

export default Back;
