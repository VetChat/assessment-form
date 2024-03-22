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
import {
  FormValue,
  Question,
  QuestionItemProps,
} from "./interface/QuestionItem";

const QuestionItem: React.FC<QuestionItemProps> = ({ onSubmitHandler }) => {
  const [isDate, setIsDate] = useState(true);

  const { data: trackingQuestion, isLoading } = useQuery<Question[]>({
    queryKey: "trackingQuestion",
    queryFn: () =>
      fetch("http://localhost:8000/ticket_questions").then((res) => res.json()),
  });

  const form = useForm({
    initialValues: {
      questions: [] as Question[],
      answerList: {} as { [key: number]: string },
    },
  });

  useEffect(() => {
    if (trackingQuestion) {
      form.setValues({
        questions: trackingQuestion,
        answerList:
          trackingQuestion &&
          trackingQuestion.reduce((acc: any, item: Question) => {
            acc[item.questionId] = "";
            return acc;
          }, {} as { [key: number]: string }),
      });
    }
  }, [trackingQuestion]);

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  const renderQuestion = (questionItem: Question) => {
    switch (questionItem.pattern) {
      case "text":
        return (
          <div>
            <TextInput
              label={questionItem.question}
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
                    required={questionItem.isRequired}
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
            <Radio.Group label={questionItem.question} defaultValue="date">
              <div className="flex gap-3 py-3">
                <Radio
                  value="date"
                  label="ระบุ (วัน/เดือน/ปี) เกิด"
                  name={`group_${questionItem.question}`}
                  required={questionItem.isRequired}
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
                  label="ระบุอายุ (กรณีไม่ทราบวันเกิด)"
                  name={`group_${questionItem.question}`}
                  required={questionItem.isRequired}
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
                valueFormat="DD/MM/YYYY"
                placeholder="DD/MM/YYYY"
                required={questionItem.isRequired}
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
                placeholder="Age"
                allowDecimal={false}
                allowNegative={false}
                required={questionItem.isRequired}
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
    <div className="flex flex-col items-center w-full mt-20">
      {trackingQuestion && (
        <form
          onSubmit={form.onSubmit((values: FormValue) =>
            onSubmitHandler(values)
          )}
        >
          {form.values.questions.length > 0 &&
            form.values.questions.map((item: Question) => (
              <div key={item.ordinal} className="pb-5">
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
export default QuestionItem;
