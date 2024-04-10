/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TicketAnswerRead } from './TicketAnswerRead';
export type TicketQuestionRead = {
    questionId: number;
    question: string;
    pattern: string;
    ordinal: number;
    isRequired: boolean;
    listAnswer: (Array<TicketAnswerRead> | null);
};

