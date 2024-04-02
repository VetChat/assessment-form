export interface HomeProps {
  questionTitle: string;
}

export enum Step {
  choosePet = 0,
  chooseUrgent = 1,
  tracking = 2,
  chooseSymptom = 3,
  answerQuestion = 4,
  done = 5,
}

export interface FormAnswer {
  questionId: number;
  answer: string;
}

export interface AnswerResponse {
  animalId: number;
  listAnswer: FormAnswer[];
}

export interface Ticket {
  ticketId: number;
}

export interface UrgentCase {
  urgentId: number;
  urgentName: string;
  urgencyId: number;
}

export interface WarningRes {
  urgentId: number;
  urgencyId: number;
}

export interface Symptom {
  symptomId: number;
  symptomName: string;
  questionSetId: number;
}

export interface AnswerRecord {
  ticketId: number;
  listAnswer: {
    answerId: number;
  }[];
}
