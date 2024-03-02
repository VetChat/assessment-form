export interface HomeProps {
  questionTitle: string;
}

export enum Step {
  choosePet = 0,
  chooseUrgent = 1,
  track = 2,
  chooseGeneral = 3,
  answerQuestion = 4,
  done = 5,
}
