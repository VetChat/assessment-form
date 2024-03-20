import { useState } from "react";
import AnimalSelector from "../../components/AnimalSelector/AnimalSelector";
import UrgentCheckbox, {
  ResponseType,
} from "../../components/UrgentCheckbox/UrgentCheckbox";
import ProgressBar from "../../components/Footer/ProgressBar";
import { Step } from "./Interface/Home.ts";
import axios from "axios";
import { CiWarning } from "react-icons/ci";
import TrackingQuestion from "../../components/QuestionItem/TrackingQuestion.tsx";

interface WarningType {
  urgencyDetail: string;
  duration: string;
}

const Home = () => {
  const [animalId, setAnimalId] = useState<number>();
  const [stepNumber, setStepNumber] = useState(Step.choosePet);
  const [warning, setWarning] = useState<WarningType | null>(null);

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
    <div className="flex w-full justify-center items-center overflow-auto">
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
      {stepNumber === Step.answerQuestion && <TrackingQuestion />}
      {/* <ProgressBar active={stepNumber} /> */}
    </div>
  );
};

export default Home;
