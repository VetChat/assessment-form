import { useForm } from "@mantine/form";
import { Group, NumberInput, Radio, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useState } from "react";

interface TrackingQuestionType {
  questionId: number;
  questionText: string;
  pattern: string;
  required: boolean;
  choices?: ChoiceType[];
}

interface ChoiceType {
  choiceId: number;
  choiceText: string;
}

const mockedQuestion: TrackingQuestionType[] = [
  {
    questionId: 0,
    questionText: "What is your pet id?",
    pattern: "text",
    required: false,
  },
  {
    questionId: 1,
    questionText: "Specify sex",
    pattern: "choice",
    required: true,
    choices: [
      { choiceId: 1, choiceText: "Male" },
      { choiceId: 2, choiceText: "Female" },
    ],
  },
  {
    questionId: 2,
    questionText: "Birth Date (or Approximate year)",
    pattern: "birthDate",
    required: true,
  },
];

interface ResponseType {
  questionId: number;
  answer: string | Date | number | null;
}

const TrackingQuestion = () => {
  const [isDate, setIsDate] = useState(true);

  const form = useForm({
    initialValues: {
      questions: mockedQuestion,
      answerList: mockedQuestion.map((item) => ({
        questionId: item.questionId,
        answer: null,
      })),
    },
  });

  console.log(form.values);

  const renderQuestion = (questionItem: TrackingQuestionType) => {
    switch (questionItem.pattern) {
      case "text":
        return (
          <div>
            <TextInput
              label={questionItem.questionText}
              className="w-[500px]"
              {...form.getInputProps(
                `answerList.${questionItem.questionId}.answer`
              )}
              required={questionItem.required}
            />
          </div>
        );
      case "choice":
        if (questionItem.choices) {
          return (
            <Radio.Group
              name={`question_${questionItem.questionId}`}
              label={questionItem.questionText}
              withAsterisk={questionItem.required}
            >
              <Group mt="xs">
                {questionItem.choices.map((choice) => (
                  <Radio
                    key={choice.choiceId}
                    value={choice.choiceId.toString()}
                    label={choice.choiceText}
                    checked={
                      form.values.answerList[questionItem.questionId]
                        ?.answer === choice.choiceId
                    }
                    onChange={() => {
                      form.setFieldValue(
                        `answerList.${questionItem.questionId}.answer`,
                        choice.choiceId
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
        return (
          <div className="pb-[10px]">
            <Radio.Group
              label={questionItem.questionText}
              name={`question_${questionItem.questionId}`}
              required={questionItem.required}
            >
              <Group mt="xs">
                <Radio
                  value="date"
                  label="ระบุวันเกิด"
                  onChange={() => {
                    setIsDate(true);
                  }}
                />
                <Radio
                  value="year"
                  label="ระบุอายุ (ปี) โดยประมาณ"
                  onChange={() => {
                    setIsDate(false);
                  }}
                />
              </Group>
            </Radio.Group>
            {isDate ? (
              <DateInput
                {...form.getInputProps(
                  `answerList.${questionItem.questionId}.answer`
                )}
                valueFormat="DD/MM/YYYY HH:mm:ss"
                label="Birth Date"
                placeholder="MM/DD/YYYY"
              />
            ) : (
              <NumberInput
                {...form.getInputProps(
                  `answerList.${questionItem.questionId}.answer`
                )}
                label="Age"
                placeholder="Age"
              />
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full mt-20 overflow-y-scroll pb-10">
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        {mockedQuestion.map((item, index) => (
          <div key={index} className="text-left pb-8">
            {renderQuestion(item)}
          </div>
        ))}
      </form>
    </div>
  );
};
export default TrackingQuestion;
