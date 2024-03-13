import { Button, Checkbox, LoadingOverlay } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { useState } from "react";
import { useQuery } from "react-query";

interface UrgentCheckboxProps {
  onSubmit: (selectedOption: ResponseType[]) => void;
  onBack: () => void;
  animalId: number;
}

interface UrgentType {
  urgentId: number;
  urgentName: string;
  urgencyId: number;
}

export interface ResponseType {
  urgentId: number;
  urgencyId: number;
}

interface UrgentOption {
  urgent: UrgentType;
  checked: boolean;
  key: string;
}

const UrgentCheckbox: React.FC<UrgentCheckboxProps> = ({
  animalId,
  onSubmit,
  onBack,
}) => {
  const [option, optionHandlers] = useListState<UrgentOption>([]);
  const [isNone, setNone] = useState(false);

  const { isLoading } = useQuery({
    queryKey: ["urgentCases"],
    queryFn: async () =>
      fetch(`http://localhost:8000/urgent_cases/animal/${animalId}`).then(
        (res) =>
          res
            .json()
            .then((data) =>
              data.map((value: UrgentType) => ({
                urgent: value,
                checked: false,
                urgencyId: value.urgencyId,
                key: value.urgencyId.toString(),
              }))
            )
            .then((data) => optionHandlers.setState(data))
      ),
  });

  const handleSubmit = () => {
    const selectedOption = option
      .filter((item) => item.checked)
      .map((value) => ({
        urgentId: value.urgent.urgentId,
        urgencyId: value.urgent.urgencyId,
      }));

    console.log("selected: ", selectedOption);

    if (selectedOption.length > 0 || isNone) {
      onSubmit(selectedOption);
    } else {
      alert("โปรดเลือกอย่างน้อย 1 อาการ");
    }
  };

  if (isLoading) {
    return <LoadingOverlay visible>Loading...</LoadingOverlay>;
  }

  return (
    <>
      <div className="font-medium text-xl pb-4 pt-20">
        โปรดเลือกอาการฉุกเฉินที่พบในสัตว์เลี้ยงของคุณ
      </div>
      {option.map((value, index) => (
        <Checkbox
          size="md"
          className="p-4"
          color="green"
          key={value.key}
          label={value.urgent.urgentName}
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
      <div className="flex w-full justify-between">
        <Button
          color="red"
          variant="outline"
          className="mt-10"
          onClick={() => onBack()}
        >
          Back
        </Button>
        <Button
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

export default UrgentCheckbox;
