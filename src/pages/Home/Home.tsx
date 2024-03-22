import { useEffect, useState } from "react";
import AnimalSelector from "../../components/AnimalSelector/AnimalSelector";
import UrgentCheckbox, {
  ResponseType,
} from "../../components/UrgentCheckbox/UrgentCheckbox";
import { Answer, AnswerResponse, Step, Ticket } from "./Interface/Home.ts";
import axios from "axios";
import { CiWarning } from "react-icons/ci";
import QuestionItem from "../../components/QuestionItem/QuestionItem.tsx";
import { useMutation } from "react-query";
import { FormValue } from "../../components/QuestionItem/interface/QuestionItem";

interface WarningType {
  urgencyDetail: string;
  duration: string;
}

const Home = () => {
  const [animalId, setAnimalId] = useState<number>();
  const [stepNumber, setStepNumber] = useState(Step.choosePet);
  const [warning, setWarning] = useState<WarningType | null>(null);
  const [ticketId, setTicketId] = useState<number>();

  const { mutate } = useMutation({
    mutationFn: (answer: AnswerResponse) =>
      fetch("http://localhost:8000/tickets", {
        method: "POST",
        body: JSON.stringify(answer),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      })
        .then((res) => res.json())
        .then((ticket: Ticket) => setTicketId(ticket.ticketId)),
  });

  const handleSelectAnimal = (id: number | undefined) => {
    if (id) {
      setAnimalId(id);
      setStepNumber(Step.chooseUrgent);
    }
  };

  const handleSelectUrgent = (selectedOption: ResponseType[]) => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/urgency/most_urgent",
          selectedOption
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching warning:", error);
      }
    };
    if (selectedOption.length > 0) {
      setStepNumber(Step.done);
      const urgencyWarning = fetchData();
      urgencyWarning.then((warn) => setWarning(warn));
    } else if (selectedOption.length === 0) {
      setStepNumber(Step.answerQuestion);
    }
  };

  const handleBack = () => {
    if (stepNumber > Step.choosePet) {
      setStepNumber(stepNumber - 1);
    }
  };

  const mapFormToAnswer = (formValue: FormValue) => {
    const ans: Answer[] = [];
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
    mutate({
      animalId: animalId!,
      listAnswer: answerList,
    });
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
          <UrgentCheckbox
            onSubmit={handleSelectUrgent}
            onBack={handleBack}
            animalId={animalId!}
          />
        </div>
      )}
      {stepNumber === Step.answerQuestion && (
        <QuestionItem onSubmitHandler={handleSubmitHistory} />
      )}
      {/* <ProgressBar active={stepNumber} /> */}
    </div>
  );
};

export default Home;
