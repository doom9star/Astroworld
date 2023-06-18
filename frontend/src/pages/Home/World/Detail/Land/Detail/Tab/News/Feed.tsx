import { GrAdd } from "react-icons/gr";
import Button from "../../../../../../../../components/Button";
import { useParams } from "react-router-dom";

export default function Feed() {
  const params = useParams();
  return (
    <div className="flex">
      <div className="w-5/6"></div>
      <Button
        label="New"
        icon={<GrAdd />}
        linkProps={{
          to: `/home/world/${params.wid}/${params.lid}/visit/news/new`,
        }}
      />
    </div>
  );
}
