import { SetStateAction, useEffect, useState } from "react";
import AnimalSelector from "../../components/AnimalSelector/AnimalSelector";
import { Affix, Button, Transition, ComboboxOption } from "@mantine/core";
import UrgentCheckbox from "../../components/UrgentCheckbox/UrgentCheckbox";
import ProgressBar from "../../components/Footer/ProgressBar";
import { Step } from "./Interface/Home";

const Home = () => {
  const [animalId, setAnimalId] = useState<number>();
  const [urgentList, setUrgentList] = useState([]);
  const [stepNumber, setStepNumber] = useState(0);

  const stepHandler = () => {
    if (!animalId) {
      setStepNumber(Step.choosePet);
    } else if (animalId) {
      setStepNumber(Step.chooseUrgent);
    }
  };

  useEffect(() => {
    stepHandler();
  }, [animalId]);

  const handleSelectAnimal = (id: number | undefined) => {
    setAnimalId(id);
  };

  return (
    <>
      <div className="mx-40 pt-20 pb-10 text-left">
        {!animalId && <AnimalSelector onSubmit={handleSelectAnimal} />}
        {animalId && (
          <div>
            <UrgentCheckbox animalId={animalId} />
          </div>
        )}
      </div>
      <ProgressBar active={stepNumber} />
    </>
  );
};

export default Home;
