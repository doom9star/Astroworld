import { BsChevronLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

type Props = {
  handler?: () => void;
  to?: { url: string; state: any };
};

function Back({ handler, to }: Props) {
  const navigate = useNavigate();
  return (
    <Button
      icon={<BsChevronLeft />}
      linkProps={{
        to: to?.url ? to.url : "#",
        state: to?.state ? to.state : "",
      }}
      btnProps={{
        onClick: () => {
          if (handler) handler();
          if (!to) {
            navigate(-1);
          }
        },
      }}
    />
  );
}

export default Back;
