import { SetStateAction, useState } from "react";
import AnimalSelector from "../../components/AnimalSelector/AnimalSelector";
import { Affix, Button, Transition, ComboboxOption } from "@mantine/core";
import UrgentCheckbox from "../../components/UrgentCheckbox/UrgentCheckbox";

const Home = () => {
  const [animalId, setAnimalId] = useState<number>();
  const [urgentList, setUrgentList] = useState([]);

  const handleSelectAnimal = (id: number | undefined) => {
    setAnimalId(id);
  };

  return (
    <div className="px-40 pt-20 pb-10 text-left">
      {!animalId && <AnimalSelector onSubmit={handleSelectAnimal} />}
      {animalId && (
        <div>
          <UrgentCheckbox animalId={animalId} />
        </div>
      )}
    </div>
  );
};

export default Home;
