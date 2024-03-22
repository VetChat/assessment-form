export interface FormValue {
  questions: Question[];
  answerList: { [key: number]: string };
}

export interface Question {
  questionId: number;
  question: string;
  pattern: string;
  ordinal?: number;
  isRequired: boolean;
  listAnswer?: Choice[];
}

export interface Choice {
  answerId: number;
  answer: string;
}

export interface QuestionItemProps {
  onSubmitHandler: (formValue: FormValue) => void;
}
