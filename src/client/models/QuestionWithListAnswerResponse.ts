/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnswerCreateUpdateDeleteBulkResponse } from './AnswerCreateUpdateDeleteBulkResponse';
export type QuestionWithListAnswerResponse = {
    questionId: number;
    question: string;
    pattern: string;
    imagePath?: (string | null);
    ordinal: number;
    listAnswer: AnswerCreateUpdateDeleteBulkResponse;
    message: string;
};

