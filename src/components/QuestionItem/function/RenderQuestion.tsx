import { Group, NumberInput, Radio, TextInput } from "@mantine/core";
import { Question, RenderQuestionProps } from "../interface/QuestionItem";
import { useState } from "react";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";

export const RenderQuestion: React.FC<RenderQuestionProps> = ({
  questionItem,
  form,
}) => {
  const [isDate, setIsDate] = useState(true);
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
            defaultValue={answerId}
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
                    if (!questionItem.ordinal) {
                      return;
                    }
                    if (choice.skipToQuestion && choice.skipToQuestion != 999) {
                      const skipToQuestionIndex =
                        choice.skipToQuestion -
                        questionItem.ordinal +
                        questionItem.questionIndex!;
                      for (
                        let i = questionItem.questionIndex! + 1;
                        i < skipToQuestionIndex;
                        i++
                      ) {
                        const skippedFrom = [
                          ...(form.values.questions[i].skippedFrom || []),
                          questionItem.questionId,
                        ];
                        console.log("skippedFrom: ", skippedFrom);
                        form.setFieldValue(
                          `questions.${i}.skippedFrom`,
                          skippedFrom
                        );
                      }
                    } else if (choice.skipToQuestion === 999) {
                      form.values.questions
                        .filter(
                          (question) =>
                            question.group === questionItem.group &&
                            question.ordinal! > questionItem.ordinal!
                        )
                        .map((item) => {
                          form.setFieldValue(
                            `questions.${item.questionIndex}.skippedFrom`,
                            [
                              ...(form.values.questions[item.questionIndex!]
                                .skippedFrom || []),
                              questionItem.questionId,
                            ]
                          );
                        });
                    } else if (choice.skipToQuestion === null) {
                      form.values.questions.map(
                        (q: Question, index: number) => {
                          if (
                            q.skippedFrom &&
                            q.skippedFrom.includes(questionItem.questionId!)
                          ) {
                            const updatedSkippedFrom = q.skippedFrom.filter(
                              (skipFrom: number) =>
                                skipFrom !== questionItem.questionId
                            );
                            form.setFieldValue(
                              `questions.${index}.skippedFrom`,
                              updatedSkippedFrom
                            );
                          }
                        }
                      );
                    }
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
              maxLength={3}
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
