/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnswerRecordCreate } from '../models/AnswerRecordCreate';
import type { AnswerRecordResponse } from '../models/AnswerRecordResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AnswerRecordsService {
    /**
     * Create Answer Records
     * @returns AnswerRecordResponse Successful Response
     * @throws ApiError
     */
    public static answerRecordsCreateAnswerRecords({
        requestBody,
    }: {
        requestBody: AnswerRecordCreate,
    }): CancelablePromise<AnswerRecordResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/answer_records',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
