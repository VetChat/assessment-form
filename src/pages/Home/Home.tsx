import { useEffect, useState } from "react";
import AnimalSelector from "../../components/AnimalSelector/AnimalSelector";
import CheckboxItem from "../../components/CheckboxItem/CheckboxItem.tsx";
import {
  FormAnswer,
  AnswerResponse,
  Step,
  Symptom,
  Ticket,
  WarningRes,
} from "./Interface/Home.ts";
import axios from "axios";
import { CiWarning } from "react-icons/ci";
import QuestionItem from "../../components/QuestionItem/QuestionItem.tsx";
import { useMutation, useQuery } from "react-query";
import {
  FormValue,
  Question,
  QuestionSet,
} from "../../components/QuestionItem/interface/QuestionItem";
import { CheckboxOption } from "../../components/CheckboxItem/interface/CheckboxItem.ts";
import { UrgentCase } from "./Interface/Home";
import { LoadingOverlay } from "@mantine/core";

interface WarningType {
  urgencyDetail: string;
  duration: string;
}

const Home = () => {
  const [animalId, setAnimalId] = useState<number>();
  const [stepNumber, setStepNumber] = useState(Step.choosePet);
  const [warning, setWarning] = useState<WarningType | null>(null);
  const [ticketId, setTicketId] = useState<number>();
  const [QA, setQA] = useState<QuestionSet[]>([]);

  const ticket = useMutation({
    mutationFn: (answer: AnswerResponse) =>
      fetch("http://localhost:8000/tickets", {
        method: "POST",
        body: JSON.stringify(answer),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      })
        .then((res) => res.json())
        .then((ticket: Ticket) => setTicketId(ticket.ticketId)),
  });

  const trackingQuestion = useQuery<Question[]>({
    queryKey: ["trackingQuestion"],
    queryFn: () =>
      fetch("http://localhost:8000/ticket_questions").then((res) => res.json()),
  });

  const urgentCases = useQuery<UrgentCase[]>({
    queryKey: ["urgentCases"],
    queryFn: () =>
      fetch(`http://localhost:8000/urgent_cases/animal/${animalId}`).then(
        (res) => res.json()
      ),
    enabled: !!animalId,
  });

  const symptoms = useQuery<Symptom[]>({
    queryKey: ["symptoms"],
    queryFn: () =>
      fetch(`http://localhost:8000/symptoms/animal/${animalId}`).then((res) =>
        res.json()
      ),
    enabled: !!animalId && stepNumber === Step.chooseSymptom,
  });

  const questionSet = useMutation({
    mutationKey: ["questionSet"],
    mutationFn: (
      question: {
        questionSetId: number;
      }[]
    ) =>
      fetch(`http://localhost:8000/questions/question_set_ids`, {
        method: "POST",
        body: JSON.stringify(question),
        headers: { "Content-Type": "application/json; charset=UTF-8" },
      }).then((res) => res.json()),
  });

  const mapUrgentToOption = (value: UrgentCase[] | undefined) => {
    if (!value) {
      return;
    }
    const option: CheckboxOption[] = value.map((item) => ({
      id: item.urgentId,
      label: item.urgentName,
      checked: false,
    }));
    return option;
  };

  const mapSymptomtoOption = (value: Symptom[] | undefined) => {
    if (!value) {
      return;
    }
    const option: CheckboxOption[] = value.map((item) => ({
      id: item.questionSetId,
      label: item.symptomName,
      checked: false,
    }));
    return option;
  };

  const handleSelectAnimal = (id: number | undefined) => {
    if (id) {
      setAnimalId(id);
      setStepNumber(Step.chooseUrgent);
    }
  };

  const handleSelectUrgent = (selectedOption: CheckboxOption[]) => {
    const selectedId = selectedOption.map((item) => item.id);
    const filtered = urgentCases.data!.filter((item) =>
      selectedId.includes(item.urgentId)
    );

    const resposeBody: WarningRes[] = filtered.map((item) => ({
      urgencyId: item.urgencyId,
      urgentId: item.urgentId,
    }));

    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/urgency/most_urgent",
          resposeBody
        );
        return response.data;
      } catch (error) {}
    };
    if (selectedOption.length > 0) {
      setStepNumber(Step.done);
      const urgencyWarning = fetchData();
      urgencyWarning.then((warn) => setWarning(warn));
    } else if (selectedOption.length === 0) {
      setStepNumber(Step.tracking);
    }
  };

  const handleSelectSymptom = async (selectedOption: CheckboxOption[]) => {
    if (selectedOption.length === 0) {
      alert("Please contact vet");
      return;
    }
    const responseBody = selectedOption.map((item) => ({
      questionSetId: item.id,
    }));
    questionSet
      .mutateAsync(responseBody)
      .then((res: QuestionSet[]) => setQA(res));
    setStepNumber(Step.answerQuestion);
  };

  const handleBack = () => {
    if (stepNumber > Step.choosePet) {
      setStepNumber(stepNumber - 1);
    }
  };

  const mapFormToAnswer = (formValue: FormValue) => {
    const ans: FormAnswer[] = [];
    for (const key in formValue.answerList) {
      ans.push({
        questionId: parseInt(key),
        answer: formValue.answerList[key],
      });
    }
    return ans;
  };

  const handleSubmitHistory = (value: FormValue) => {
    const answerList = mapFormToAnswer(value);
    ticket.mutate({
      animalId: animalId!,
      listAnswer: answerList,
    });
    setStepNumber(Step.chooseSymptom);
  };

  const handleSubmitQuestionSet = (value: FormValue) => {
    console.log("questionSetAnswer: ", value);
  };

  useEffect(() => {
    console.log(ticketId);
  }, [ticketId]);

  if (warning) {
    return (
      <div className="flex flex-col pt-20 justify-center items-center">
        <CiWarning className="text-red-400 text-9xl"></CiWarning>
        <label className="text-[25px] font-semibold">
          {warning.urgencyDetail}
        </label>
        <br />
        <label>
          Please contact veterinary hospital within: {warning.duration}
        </label>
        {/* <ProgressBar active={Step.done} /> */}
      </div>
    );
  }

  return (
    <div className="flex w-full h-full justify-center overflow-auto bg-white">
      {stepNumber === Step.choosePet && (
        <AnimalSelector onSubmit={handleSelectAnimal} />
      )}
      {stepNumber === Step.chooseUrgent && (
        <div>
          {urgentCases.isLoading ? (
            <LoadingOverlay visible>Loading...</LoadingOverlay>
          ) : (
            <CheckboxItem
              title="โปรดเลือกอาการฉุกเฉินที่พบในสัตว์เลี้ยงของคุณ"
              optionList={mapUrgentToOption(urgentCases.data) ?? []}
              onSubmit={handleSelectUrgent}
              onBack={handleBack}
            />
          )}
        </div>
      )}
      {stepNumber === Step.tracking && (
        <QuestionItem
          onSubmitHandler={handleSubmitHistory}
          questionSet={[{ listQuestion: trackingQuestion?.data! }]}
        />
      )}
      {stepNumber === Step.chooseSymptom && (
        <div>
          <CheckboxItem
            title="โปรดระบุอาการที่พบ"
            optionList={mapSymptomtoOption(symptoms.data) ?? []}
            onSubmit={handleSelectSymptom}
            onBack={handleBack}
          />
        </div>
      )}
      {stepNumber === Step.answerQuestion && QA && (
        <QuestionItem
          isQA={true}
          questionSet={QA}
          onSubmitHandler={handleSubmitQuestionSet}
        />
      )}
      {/* <ProgressBar active={stepNumber} /> */}
    </div>
  );
};

export default Home;
