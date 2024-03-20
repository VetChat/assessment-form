import { useForm } from "@mantine/form";
import {
  Button,
  Group,
  LoadingOverlay,
  NumberInput,
  Radio,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

interface TrackingQuestionType {
  questionId: number;
  question: string;
  pattern: string;
  ordinal?: number;
  isRequired: boolean;
  listAnswer?: ChoiceType[];
}

interface ChoiceType {
  answerId: number;
  answer: string;
}

const TrackingQuestion = () => {
  const [isDate, setIsDate] = useState(true);

  const { data: trackingQuestion, isLoading } = useQuery<
    TrackingQuestionType[]
  >({
    queryKey: "trackingQuestion",
    queryFn: () =>
      fetch("http://localhost:8000/ticket_questions").then((res) => res.json()),
  });

  const form = useForm({
    initialValues: {
      questions: [] as TrackingQuestionType[],
      answerList: {} as { [key: number]: string },
    },
  });

  useEffect(() => {
    if (trackingQuestion) {
      form.setValues({
        questions: trackingQuestion,
        answerList:
          trackingQuestion &&
          trackingQuestion.reduce((acc: any, item: TrackingQuestionType) => {
            acc[item.questionId] = "";
            return acc;
          }, {} as { [key: number]: string }),
      });
    }
  }, [trackingQuestion]);

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  const renderQuestion = (questionItem: TrackingQuestionType) => {
    console.log(form!.values);
    switch (questionItem.pattern) {
      case "text":
        return (
          <div>
            <TextInput
              label={questionItem.question}
              className="w-[500px]"
              {...form?.getInputProps(`answerList.${questionItem.questionId}`)}
              required={questionItem.isRequired}
            />
          </div>
        );
      case "choice":
        if (questionItem.listAnswer) {
          const answerId = form.values.answerList[questionItem.questionId];
          return (
            <Radio.Group
              label={questionItem.question}
              withAsterisk={questionItem.isRequired}
            >
              <Group mt="xs">
                {questionItem.listAnswer.map((choice) => (
                  <Radio
                    key={choice.answerId}
                    value={choice.answerId.toString()}
                    label={choice.answer}
                    checked={answerId === choice.answerId.toString()}
                    onChange={() => {
                      form.setFieldValue(
                        `answerList.${questionItem.questionId}`,
                        choice.answerId.toString()
                      );
                    }}
                  />
                ))}
              </Group>
            </Radio.Group>
          );
        }
        break;
      case "birthDate":
        const answer = form!.values.answerList[questionItem.questionId];
        return (
          <div>
            <Radio.Group
              label={questionItem.question}
              required={questionItem.isRequired}
            >
              <div className="flex gap-3">
                <Radio
                  value="date"
                  label="Specify birth date"
                  name={`group_${questionItem.question}`}
                  checked={isDate}
                  onChange={() => {
                    setIsDate(true);
                    if (answer) {
                      form!.setFieldValue(
                        `answerList.${questionItem.questionId}`,
                        ""
                      );
                    }
                  }}
                />
                <Radio
                  value="year"
                  label="Specify approximate age (years)"
                  name={`group_${questionItem.question}`}
                  checked={!isDate}
                  onChange={() => {
                    setIsDate(false);
                    if (answer) {
                      form!.setFieldValue(
                        `answerList.${questionItem.questionId}`,
                        ""
                      );
                    }
                  }}
                />
              </div>
            </Radio.Group>
            {isDate ? (
              <DateInput
                label="Birth Date"
                valueFormat="DD/MM/YYYY"
                placeholder="DD/MM/YYYY"
                onChange={(e) => {
                  if (!e) {
                    return;
                  }
                  const date = dayjs(e).format("YYYY-MM-DD");
                  form.setFieldValue(
                    `answerList.${questionItem.questionId}`,
                    date
                  );
                }}
              />
            ) : (
              <NumberInput
                label="Age"
                placeholder="Age"
                allowDecimal={false}
                allowNegative={false}
                onChange={(e) => {
                  if (!e) {
                    return;
                  }
                  const date = dayjs().set(
                    "year",
                    dayjs().year() - (e as number)
                  );
                  form.setFieldValue(
                    `answerList.${questionItem.questionId}`,
                    date.format("YYYY-MM-DD")
                  );
                }}
              />
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full mt-20 pb-10">
      {trackingQuestion && (
        <form
          onSubmit={form.onSubmit((values) => console.log("res: ", values))}
        >
          {form.values.questions.length > 0 &&
            form.values.questions.map((item: TrackingQuestionType) => (
              <div key={item.ordinal} className="text-left pb-8">
                {renderQuestion(item)}
              </div>
            ))}
          <Group justify="flex-end" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      )}
    </div>
  );
};
export default TrackingQuestion;
