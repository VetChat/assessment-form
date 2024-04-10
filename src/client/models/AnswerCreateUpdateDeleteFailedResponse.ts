/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnswerCreateFailed } from './AnswerCreateFailed';
import type { AnswerDeleteResponse } from './AnswerDeleteResponse';
import type { AnswerUpdateFailed } from './AnswerUpdateFailed';
export type AnswerCreateUpdateDeleteFailedResponse = {
    create?: (Array<AnswerCreateFailed> | null);
    update?: (Array<AnswerUpdateFailed> | null);
    delete?: (Array<AnswerDeleteResponse> | null);
};

