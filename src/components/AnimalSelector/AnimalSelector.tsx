import { Button, Combobox, InputBase, useCombobox } from "@mantine/core";
import React, { useState } from "react";
import { useQuery } from "react-query";

interface Animal {
  animalId: number;
  animalName: string;
}

interface AnimalSelectorProps {
  onSubmit: (id: number | undefined) => void;
}

const AnimalSelector: React.FC<AnimalSelectorProps> = ({ onSubmit }) => {
  const [search, setSearch] = useState("");
  const [value, setValue] = useState<string | null>(null);

  const { data: animals } = useQuery<Animal[]>({
    queryKey: ["animals"],
    queryFn: () =>
      fetch("http://localhost:8000/animals").then((res) => res.json()),
    staleTime: 60000,
  });

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const shouldFilterOptions =
    Array.isArray(animals) &&
    animals.every((item) => item.animalName !== search);

  const filteredOptions = shouldFilterOptions
    ? animals?.filter((item) =>
        item.animalName.toLowerCase().includes(search.toLowerCase().trim())
      )
    : animals;

  const options =
    Array.isArray(filteredOptions) &&
    filteredOptions.map((animal) => (
      <Combobox.Option key={animal.animalId} value={animal.animalName}>
        {animal.animalName}
      </Combobox.Option>
    ));

  return (
    <div className="flex-col w-[500px] px-10 pt-20 text-left">
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
            {options ? options : <Combobox.Empty>Nothing found</Combobox.Empty>}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
      <div className="flex w-full justify-end">
        <Button
          color="teal"
          variant="light"
          onClick={() =>
            onSubmit(
              animals?.find((animal) => animal.animalName == value)?.animalId
            )
          }
          className="mt-10"
          disabled={!value}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AnimalSelector;
