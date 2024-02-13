export type QuestionProps = {
    title: string;
    options: string[];
    answer: string;
    setAnswer: (answer: string) => void;
    nextQuestion: () => void;
    prevQuestion: () => void;
    questionIndex: number;
    totalQuestions: number;
    setTotalQuestions: (totalQuestions: number) => void;
    setQuestionIndex: (questionIndex: number) => void;
    setAnswered: (answered: boolean) => void;
    answered: boolean;
}