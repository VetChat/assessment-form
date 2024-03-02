import React from "react";
import { QuestionCardProps } from "./interface/QuestionCard";

const QuestionCard: React.FC<QuestionCardProps> = ({
  children,
  additionnalClass,
}) => {
  return (
    <div className={`rounded-md shadow w-full p-14 ${additionnalClass}`}>
      {children}
    </div>
  );
};

export default QuestionCard;
