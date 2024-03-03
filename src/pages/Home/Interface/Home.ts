export interface HomeProps {
  questionTitle: string;
}

export enum Step {
  choosePet = 0,
  chooseUrgent = 1,
  answerQuestion = 2,
  done = 3,
}
