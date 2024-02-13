import { Button, Combobox, InputBase, useCombobox } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";

type animalList = {
  animal_id: number;
  name: string;
}[];

interface AnimalSelectorProps {
  onSubmit: (id: number | undefined) => void;
}

const AnimalSelector: React.FC<AnimalSelectorProps> = ({ onSubmit }) => {
  const [animals, setAnimals] = useState<animalList>([]);
  const [search, setSearch] = useState("");
  const [value, setValue] = useState<string | null>(null);

  const animalQuery = useQuery({
    queryKey: ["animals"],
    queryFn: async () => {
      const response = await fetch("http://localhost:8000/animals");
      return response.json();
    },
  });

  useEffect(() => {
    console.log(animalQuery.isFetching);
    if (animalQuery.data) {
      setAnimals(animalQuery.data);
    }
  }, []);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const shouldFilterOptions = animals.every((item) => item.name !== search);
  const filteredOptions = shouldFilterOptions
    ? animals.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase().trim())
      )
    : animals;

  const options = filteredOptions.map((animal) => (
    <Combobox.Option key={animal.animal_id} value={animal.name}>
      {animal.name}
    </Combobox.Option>
  ));

  return (
    <div>
      <div className="font-medium text-xl pb-4">
        โปรดเลือกชนิดของสัตว์เลี้ยง
      </div>
      <Combobox
        store={combobox}
        withinPortal={false}
        onOptionSubmit={(val) => {
          setValue(val);
          setSearch(val);
          combobox.closeDropdown();
        }}
      >
        <Combobox.Target>
          <InputBase
            pointer
            rightSection={<Combobox.Chevron />}
            value={search}
            onChange={(event) => {
              combobox.openDropdown();
              combobox.updateSelectedOptionIndex();
              setSearch(event.currentTarget.value);
            }}
            onClick={() => combobox.toggleDropdown()}
            onBlur={() => {
              combobox.closeDropdown();
              setSearch(value || "");
            }}
            rightSectionPointerEvents="none"
            placeholder="Search value"
          ></InputBase>
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Options className="text-left">
            {options.length > 0 ? (
              options
            ) : (
              <Combobox.Empty>Nothing found</Combobox.Empty>
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
      <Button
        onClick={(event) =>
          onSubmit(animals.find((animal) => animal.name == value)?.animal_id)
        }
        className="mt-4"
      >
        Submit
      </Button>
    </div>
  );
};

export default AnimalSelector;
