import { useForm } from "@mantine/form";
import { Button, Group } from "@mantine/core";
import { useEffect, useState } from "react";
import {
  FormValue,
  Question,
  QuestionItemProps,
} from "./interface/QuestionItem";
import { RenderQuestion } from "./function/RenderQuestion";

const QuestionItem: React.FC<QuestionItemProps> = ({
  onSubmitHandler,
  questionSet,
  isQA = false,
}) => {
  const [groupList, setGroupList] = useState<number[]>([]);
  const [currentGroup, setCurrentGroup] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question[]>([]);
  const [isFirst, setIsFirst] = useState<boolean>(true);
  const [isLast, setIsLast] = useState<boolean>(false);

  // const [isGoingBack, setIsGoingBack] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      questions: [] as Question[],
      answerList: {} as { [key: number]: string },
    },
  });

  useEffect(() => {
    if (!questionSet) {
      return;
    }
    if (isQA) {
      const allQuestions: Question[] = [];
      const group: number[] = [];

      // assgin group number to all question, this will be use to sperate the question for rendering
      let groupNumber = 0;
      let questionIndex = 0;
      questionSet.map((symptomQuestionSet) => {
        if (groupNumber != 0) {
          group.push(groupNumber);
          groupNumber++;
        }
        symptomQuestionSet.listQuestion.map((question) => {
          question.questionIndex = questionIndex;
          questionIndex++;
          question.skippedFrom = [];
          question.isRequired = true;
          if (
            question.pattern === "yes/no" ||
            question.pattern === "duration"
          ) {
            question.pattern = "choice";
          }

          if (
            question.listAnswer?.find(
              (answerlist) => answerlist.skipToQuestion != null
            )
          ) {
            question.group = groupNumber;
            group.push(groupNumber);
            groupNumber++;
            console.log(question.question, "has skip, group: ", question.group);
          } else {
            question.group = groupNumber;
          }
        });
      });

      setGroupList(group);
      setCurrentGroup(group[0]);

      questionSet.forEach((symptom) => {
        allQuestions.push(...symptom.listQuestion);
      });

      console.log(allQuestions);

      form.setValues({
        questions: allQuestions,
        answerList:
          allQuestions.length > 0 &&
          allQuestions.reduce((acc: any, item: Question) => {
            acc[item.questionId] = "";
            return acc;
          }, {} as { [key: number]: string }),
      });
    } else {
      const questions = questionSet[0].listQuestion; // if it is not QA there will be only 1 question set
      form.setValues({
        questions: questions,
        answerList:
          questions &&
          questions.reduce((acc: any, item: Question) => {
            acc[item.questionId] = "";
            return acc;
          }, {} as { [key: number]: string }),
      });
    }
  }, [questionSet]);

  const checkPosition = () => {
    const nextQuestion = form.values.questions.find(
      (question) =>
        question.group! > currentGroup && question.skippedFrom?.length === 0
    );
    let i = currentGroup - 1;
    let previousQuestion = undefined;
    for (i; i >= groupList[0]; i--) {
      const temp = form.values.questions.find(
        (question) =>
          question.group! === i && question.skippedFrom?.length === 0
      );
      if (temp) {
        previousQuestion = temp;
        break;
      }
    }
    // console.log("next: ", nextQuestion, " prev: ", previousQuestion);

    return [previousQuestion, nextQuestion];
  };

  useEffect(() => {
    const pointer = checkPosition();
    setIsFirst(pointer[0] ? false : true);
    setIsLast(pointer[1] ? false : true);

    // console.log("currentGroup: ", currentGroup);
    const questions = form.values.questions.filter(
      (question) =>
        question.group === currentGroup && question.skippedFrom?.length === 0
    );
    setCurrentQuestion(questions);
  }, [currentGroup]);

  const showNextQuestion = (isGoingBack: boolean) => {
    const pointer = checkPosition();
    if (isGoingBack) {
      // console.log("nextGroup: ", pointer[0]!.group!);
      pointer[0] && setCurrentGroup(pointer[0].group!);
    } else {
      // console.log("nextGroup: ", pointer[1]!.group!);
      pointer[1] && setCurrentGroup(pointer[1].group!);
    }
  };

  const handleSubmitQA = () => {
    return;
  };

  const renderButton = () => {
    if (isQA) {
      const nextButton = !isLast ? (
        <Button
          onClick={() => {
            if (form.isValid()) {
              console.log("Valid: ", form.isValid());
              showNextQuestion(false);
            }
          }}
        >
          Next
        </Button>
      ) : (
        // TODO: when submit
        // 1. Clear all answer of the skipped question
        // 2. Set all isRequired of the skipped question to false
        // 3. Submit
        <Button
          // onClick={() => console.log("Submit hit!, form values: ", form.values)}
          type="submit"
        >
          Submit
        </Button>
      );
      const backButton = !isFirst && (
        <Button
          onClick={() => {
            showNextQuestion(true);
          }}
        >
          Back
        </Button>
      );
      return (
        <Group className="flex justify-between">
          {backButton}
          {nextButton}
        </Group>
      );
    }
    return (
      <Group justify="flex-end" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    );
  };

  return (
    <div className="flex flex-col items-center w-full mt-20">
      {questionSet && (
        <form
          onSubmit={form.onSubmit((values: FormValue) =>
            onSubmitHandler(values)
          )}
        >
          {form.values.questions.length > 0 && !isQA
            ? form.values.questions.map((item: Question, index: number) => (
                <div key={index} className="pb-5">
                  <RenderQuestion questionItem={item} form={form} />
                </div>
              ))
            : currentQuestion.map((questionItem) => (
                <div key={questionItem.questionId} className="pb-5">
                  <RenderQuestion questionItem={questionItem} form={form} />
                </div>
              ))}
          {renderButton()}
        </form>
      )}
    </div>
  );
};
export default QuestionItem;
