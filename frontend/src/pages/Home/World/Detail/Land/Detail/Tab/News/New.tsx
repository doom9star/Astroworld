import classNames from "classnames";
import Back from "../../../../../../../../components/Back";
import { useCallback, useState } from "react";
import Button from "../../../../../../../../components/Button";
import { MdPostAdd } from "react-icons/md";
import { useDropzone } from "react-dropzone";
import { AiOutlineSelect, AiOutlineUpload } from "react-icons/ai";

type Info = {
  title: string;
  body: string;
};

export default function New() {
  const [info, setInfo] = useState<Info>({
    title: "",
    body: "",
  });
  const [errors] = useState<Info>({} as Info);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInfo((_info) => ({ ..._info, [e.target.name]: e.target.value }));
    },
    []
  );

  const onDrop = useCallback((files: any[]) => {}, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="px-10 flex flex-col">
      <Back />
      <div className="flex flex-col mx-16">
        <input
          type={"text"}
          autoFocus
          placeholder="Title"
          className={`input ${classNames({
            "border-red-500": errors.title,
          })}`}
          name="title"
          value={info.title}
          onChange={onChange}
        />
        <textarea
          placeholder="Write some description..."
          className={`input`}
          name="body"
          rows={8}
          value={info.body}
          onChange={onChange}
        ></textarea>
        <div {...getRootProps()} className="self-start my-4 p-2 w-full">
          <input {...getInputProps()} />
          <div className="flex justify-around items-center p-4 w-1/2 h-[100px] border">
            <div className="flex items-center my-2">
              <AiOutlineUpload className="mr-2" />
              <span className="text-xs">Drop</span>
            </div>
            <Button label="Select" icon={<AiOutlineSelect />} />
          </div>
        </div>
        <Button label="Publish" icon={<MdPostAdd />} />
      </div>
    </div>
  );
}
