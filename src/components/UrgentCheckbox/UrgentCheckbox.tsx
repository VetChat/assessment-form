import { Button, Checkbox, LoadingOverlay } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { useEffect, useState } from "react";
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
  const [urgentList, setUrgentList] = useState<UrgentType[]>([]);
  const [urgencyList, setUrgencyList] = useState<ResponseType[]>([]);
  const [option, optionHandlers] = useListState<UrgentOption>([]);
  const [isLoading, setIsLoading] = useState(true);

  const urgentListQuery = useQuery({
    queryKey: ["animalId"],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:8000/urgent_cases/animal/${animalId}`
      );
      return response.json();
    },
  });

  useEffect(() => {
    if (urgentListQuery.data) {
      setUrgentList(urgentListQuery.data);
      setIsLoading(false);
    }
  }, [urgentListQuery.data]);

  useEffect(() => {
    const options: UrgentOption[] = urgentList.map(
      (value: UrgentType, index) => ({
        urgent: value,
        checked: false,
        urgencyId: value.urgencyId,
        key: index.toString(),
      })
    );
    optionHandlers.setState(options);
  }, [urgentList]);

  const hasChecked = option.some((value) => value.checked);

  useEffect(() => {
    if (hasChecked) {
      const checkedOption = option.filter((item) => item.checked);
      setUrgencyList(
        checkedOption.map((value) => ({
          urgentId: value.urgent.urgentId,
          urgencyId: value.urgent.urgencyId,
        }))
      );
    } else {
      setUrgencyList([]);
    }
  }, [option]);

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
        checked={!hasChecked}
        onChange={() =>
          optionHandlers.setState((option) =>
            option.map((value) => ({ ...value, checked: false }))
          )
        }
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
          onClick={() => onSubmit(urgencyList)}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default UrgentCheckbox;
