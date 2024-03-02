import { Checkbox } from "@mantine/core";
import { randomId, useListState } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import QuestionCard from "../QuestionCard/QuestionCard";

const mockedUrgentList = [
  { label: "อาการท้องอืด", checked: false, urgencyId: 1, key: "1" },
  { label: "อาการท้องเสีย", checked: false, urgencyId: 2, key: "2" },
  { label: "อาการท้องผูก", checked: false, urgencyId: 3, key: "3" },
  { label: "ไม่มีอาการ", checked: false, urgencyId: 4, key: "4" },
];

interface UrgentCheckboxProps {
  animalId: number;
}

type UrgentList = {
  urgentId: number;
  urgentName: string;
  urgencyId: number;
};

type Urgency = {
  urgencyId: number;
};

type InitialValue = {
  label: string;
  checked: boolean;
  urgencyId: number;
  key: string;
};

const UrgentCheckbox: React.FC<UrgentCheckboxProps> = ({ animalId }) => {
  const [urgentList, setUrgentList] = useState<UrgentList[]>([]);
  const [urgency, setUrgency] = useState<Urgency[]>([]);
  const [values, handlers] = useListState(mockedUrgentList);

  const urgentListQuery = useQuery({
    queryKey: ["animalId"],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:8000/urgent_cases/animal/${animalId}`
      );
      return await response.json();
    },
  });

  useEffect(() => {
    if (urgentListQuery.data) {
      setUrgentList(urgentListQuery.data);
    }
  }, [urgentListQuery.data]);

  const options = values.map((value, index) => (
    <Checkbox
      className="p-4"
      key={value.key}
      label={value.label}
      checked={value.checked}
      onChange={(event) => {
        handlers.setItemProp(index, "checked", event.currentTarget.checked);
        setUrgency([...urgency, { urgencyId: value.urgencyId }]);
      }}
    ></Checkbox>
  ));

  return (
    <QuestionCard>
      <div className="font-medium text-xl pb-4">
        โปรดเลือกอาการฉุกเฉินที่พบในสัตว์เลี้ยงของคุณ
      </div>
      <div>{options}</div>
    </QuestionCard>
  );
};

export default UrgentCheckbox;
