export interface CheckboxItemProps {
  onSubmit: (selectedOption: CheckboxOption[]) => void;
  onBack: () => void;
  optionList: CheckboxOption[];
  title: string;
}

export interface CheckboxOption {
  id: number;
  label: string;
  checked: boolean;
}
