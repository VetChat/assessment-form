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
  imagePath?: string;
  ordinal?: number;
  listAnswer?: Answer[];
  isRequired?: boolean;
  skippedFrom?: number[];
  group?: number;
}

export interface Answer {
  answerId: number;
  answer: string;
  skipToQuestion?: number;
}

export interface QuestionItemProps {
  onSubmitHandler: (formValue: FormValue) => void;
  questionSet: QuestionSet[] | undefined;
  isQA?: boolean;
}

export interface RenderQuestionProps {
  form: UseFormReturnType<{
    questions: Question[];
    answerList: {
      [key: number]: string;
    };
  }>;
  questionItem: Question;
}
