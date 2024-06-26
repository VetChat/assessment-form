import { useForm } from "@mantine/form";
import { Button, Group } from "@mantine/core";
import { useEffect, useState } from "react";
import {
  FormValue,
  Question,
  QuestionItemProps,
} from "./interface/QuestionItem";
import { RenderQuestion } from "./function/RenderQuestion";
import { IoReturnDownBack } from "react-icons/io5";
import Swal from "sweetalert2";

const QuestionItem: React.FC<QuestionItemProps> = ({
  title,
  onSubmitHandler,
  questionSet,
  isQA = false,
}) => {
  const [groupList, setGroupList] = useState<number[]>([]);
  const [currentGroup, setCurrentGroup] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question[]>([]);
  const [isFirst, setIsFirst] = useState<boolean>(true);
  const [isLast, setIsLast] = useState<boolean>(false);

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
    {
      /*
    1. Set answer of the skipped function to ""
    2. Remove the skipped status of the question that got skipped by skipped question

    Returns: (Array) containing previous question and next question
    */
    }
    const skippedQuestionId = form.values.questions.filter(
      (question) => question.skippedFrom?.length! > 0
    );
    skippedQuestionId.map((question) => {
      form.values.questions
        .filter((item) => item.skippedFrom?.includes(question.questionId))
        .map((questionItem) => {
          const newSkippedFrom = questionItem.skippedFrom?.filter(
            (skippedFrom) => skippedFrom !== question.questionId
          );
          form.setFieldValue(
            `questions.${questionItem.questionIndex}.skippedFrom`,
            newSkippedFrom
          );
        });
      form.setFieldValue(`answerList.${question.questionId}`, "");
    });
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

    return [previousQuestion, nextQuestion];
  };

  useEffect(() => {
    const pointer = checkPosition();
    setIsFirst(pointer[0] ? false : true);
    setIsLast(pointer[1] ? false : true);

    const questions = form.values.questions.filter(
      (question) =>
        question.group === currentGroup && question.skippedFrom?.length === 0
    );
    setCurrentQuestion(questions);
  }, [currentGroup]);

  const showNextQuestion = (isGoingBack: boolean) => {
    const pointer = checkPosition();
    if (isGoingBack) {
      pointer[0] && setCurrentGroup(pointer[0].group!);
    } else {
      pointer[1] && setCurrentGroup(pointer[1].group!);
    }
  };

  const handleSubmitQA = () => {
    onSubmitHandler(form.values);
  };

  return (
    <div className="flex flex-col w-full items-center mt-20">
      {questionSet && (
        <form
          className="flex flex-col justify-center w-[350px]"
          onSubmit={form.onSubmit((values: FormValue) =>
            onSubmitHandler(values)
          )}
        >
          <div className="font-medium text-xl pb-4">{title}</div>
          {form.values.questions.length > 0 && !isQA
            ? form.values.questions.map((item: Question, index: number) => (
                <div key={index} className="pb-5">
                  <RenderQuestion questionItem={item} form={form} />
                </div>
              ))
            : currentQuestion.map((questionItem) => (
                <div key={questionItem.questionId} className="pb-5 w-full">
                  {questionItem.imagePath && (
                    <img src={questionItem.imagePath} alt="image" />
                  )}
                  <RenderQuestion questionItem={questionItem} form={form} />
                </div>
              ))}
          {!isQA ? (
            <Group justify="flex-end" mt="md">
              <Button type="submit">Submit</Button>
            </Group>
          ) : (
            <div className="flex w-full justify-between pt-4 pb-10">
              {isFirst ? (
                <Button leftSection={<IoReturnDownBack size={14} />}>
                  กลับไปหน้าเลือกอาการ
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    showNextQuestion(true);
                  }}
                >
                  Back
                </Button>
              )}
              {isLast ? (
                <Button onClick={() => handleSubmitQA()}>Submit</Button>
              ) : (
                <Button
                  onClick={() => {
                    console.log("formValue: ", form.values);

                    const isGroupComplete = currentQuestion.every(
                      (question) =>
                        form.values.answerList[question.questionId] !== ""
                    );
                    if (!isGroupComplete) {
                      Swal.fire({
                        title: "ข้อมูลไม่ครบ",
                        html: "กรุณากรอกข้อมูลให้ครบถ้วนก่อนไปหน้าถัดไป",
                        icon: "error",
                      });
                      return;
                    }
                    showNextQuestion(false);
                  }}
                >
                  Next
                </Button>
              )}
            </div>
          )}
        </form>
      )}
    </div>
  );
};
export default QuestionItem;
