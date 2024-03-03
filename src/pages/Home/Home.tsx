import { useEffect, useState } from "react";
import AnimalSelector from "../../components/AnimalSelector/AnimalSelector";
import UrgentCheckbox, {
  ResponseType,
} from "../../components/UrgentCheckbox/UrgentCheckbox";
import ProgressBar from "../../components/Footer/ProgressBar";
import { Step } from "./Interface/Home.ts";
import { useMutation } from "react-query";
import axios from "axios";

interface WarningType {
  urgencyDetail: string;
  duration: string;
}

const Home = () => {
  const [animalId, setAnimalId] = useState<number>();
  const [urgentList, setUrgentList] = useState<ResponseType[] | null>(null);
  const [stepNumber, setStepNumber] = useState(Step.choosePet);
  const [warning, setWarning] = useState<WarningType | null>(null);

  const handleSelectAnimal = (id: number | undefined) => {
    setAnimalId(id);
    setStepNumber(Step.chooseUrgent);
  };

  const handleSelectUrgent = (selectedOption: ResponseType[]) => {
    setUrgentList(selectedOption);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/urgency/most_urgent",
          urgentList
        );
        setWarning(response.data);
      } catch (error) {
        console.error("Error fetching warning:", error);
      }
    };

    if (urgentList && urgentList.length > 0) {
      fetchData();
    }
  }, [urgentList]);

  if (warning) {
    return (
      <div>
        {warning.urgencyDetail}
        Please contact vet within {warning.duration}
      </div>
    );
  }

  return (
    <div className="bg-[#F5F5F5] w-full h-full">
      <div className="mx-40 pt-20 pb-10 text-left">
        {stepNumber === Step.choosePet && (
          <AnimalSelector onSubmit={handleSelectAnimal} />
        )}
        {stepNumber === Step.chooseUrgent && (
          <div>
            <UrgentCheckbox
              onSubmit={handleSelectUrgent}
              animalId={animalId!}
            />
          </div>
        )}
      </div>
      <ProgressBar active={stepNumber} />
    </div>
  );
};

export default Home;
