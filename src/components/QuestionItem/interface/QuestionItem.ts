import { UseFormReturnType } from "@mantine/form";

export interface FormValue {
  questions: Question[];
  answerList: { [key: number]: string };
}

export interface QuestionSet {
  symptomId?: number;
  symptomName?: string;
  listQuestion: Question[];
}

export interface Question {
  questionId: number;
  questionIndex?: number;
  question: string;
  pattern: string;
  imagePath?: string | null;
  ordinal?: number;
  listAnswer?: Answer[] | null;
  isRequired?: boolean;
  skippedFrom?: number[];
  group?: number;
}

export interface Answer {
  answerId?: number | null;
  answer?: string | null;
  skipToQuestion?: number | null;
}

export interface QuestionItemProps {
  title: string;
  onSubmitHandler: (formValue: FormValue) => void;
  questionSet: QuestionSet[] | undefined;
  isQA?: boolean;
  animalId?: number;
}

export interface RenderQuestionProps {
  form: UseFormReturnType<{
    questions: Question[];
    answerList: {
      [key: number]: string;
    };
  }>;
  questionItem: Question;
  animalId?: number;
}
