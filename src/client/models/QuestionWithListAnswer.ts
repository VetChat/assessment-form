/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnswerRead } from './AnswerRead';
export type QuestionWithListAnswer = {
    questionId: number;
    question: string;
    pattern: string;
    imagePath?: (string | null);
    ordinal: number;
    listAnswer?: (Array<AnswerRead> | null);
};

