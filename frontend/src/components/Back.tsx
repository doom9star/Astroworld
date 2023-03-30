import { BsChevronLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

function Back() {
  const navigate = useNavigate();
  return (
    <Button
      icon={<BsChevronLeft />}
      btnProps={{
        onClick: () => navigate(-1),
      }}
    />
  );
}

export default Back;
