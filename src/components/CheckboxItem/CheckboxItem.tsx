import { Button, Checkbox } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { CheckboxOption, CheckboxItemProps } from "./interface/CheckboxItem";
import { IoReturnDownBack } from "react-icons/io5";
import { GrFormNext } from "react-icons/gr";

const CheckboxItem: React.FC<CheckboxItemProps> = ({
  optionList,
  onSubmit,
  onBack,
  title,
}) => {
  const [option, optionHandlers] = useListState<CheckboxOption>([]);
  const [isNone, setNone] = useState(false);

  useEffect(() => {
    optionHandlers.setState(optionList);
  }, [optionList]);

  const handleSubmit = () => {
    const selectedOption = option.filter((item) => item.checked);

    if (selectedOption.length > 0 || isNone) {
      onSubmit(selectedOption);
    } else {
      alert("โปรดเลือกอย่างน้อย 1 อาการ");
    }
  };

  useEffect(() => {
    const hasChecked = option.some((value) => value.checked);
    if (hasChecked) {
      setNone(false);
    }
  }, [option]);

  return (
    <>
      <div className="font-medium text-xl pb-4 pt-20">{title}</div>
      {option.map((value, index) => (
        <Checkbox
          size="md"
          className="p-4"
          color="green"
          key={index}
          label={value.label}
          checked={value.checked}
          onChange={(event) => {
            optionHandlers.setItemProp(
              index,
              "checked",
              event.currentTarget.checked
            );
          }}
        />
      ))}
      <Checkbox
        size="md"
        className="p-4"
        label={"ไม่มีอาการข้างต้น"}
        color="green"
        checked={isNone}
        onChange={(e) => {
          if (e.currentTarget.checked) {
            optionHandlers.setState((option) =>
              option.map((value) => ({ ...value, checked: false }))
            );
          }
          setNone(!isNone);
        }}
      />
      <div className="flex w-full justify-between pb-10">
        <Button
          leftSection={<IoReturnDownBack size={14} />}
          color="red"
          variant="outline"
          className="mt-10"
          onClick={() => onBack()}
        >
          Back
        </Button>
        <Button
          rightSection={<GrFormNext size={14} />}
          disabled={!(option.some((value) => value.checked) || isNone)}
          color="teal"
          variant="light"
          className="mt-10"
          onClick={() => handleSubmit()}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default CheckboxItem;
