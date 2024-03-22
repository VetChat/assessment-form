export interface HomeProps {
  questionTitle: string;
}

export enum Step {
  choosePet = 0,
  chooseUrgent = 1,
  answerQuestion = 2,
  done = 3,
}

export interface Answer {
  questionId: number;
  answer: string;
}

export interface AnswerResponse {
  animalId: number;
  listAnswer: Answer[];
}

export interface Ticket {
  ticketId: number;
}
