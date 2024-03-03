import { Button, Combobox, InputBase, useCombobox } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";

type animalList = {
  animalId: number;
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
      const jsonData = await response.json();
      return jsonData;
    },
  });

  useEffect(() => {
    if (animalQuery.data) {
      setAnimals(animalQuery.data);
    }
  }, [animalQuery.data]);

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
    <Combobox.Option key={animal.animalId} value={animal.name}>
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
      <div className="flex w-full justify-end">
        <Button
          color="teal"
          variant="light"
          onClick={() =>
            onSubmit(animals.find((animal) => animal.name == value)?.animalId)
          }
          className="mt-10"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AnimalSelector;
