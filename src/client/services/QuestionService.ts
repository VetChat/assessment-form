/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_Question_update_questions } from '../models/Body_Question_update_questions';
import type { QuestionCreateUpdateDeleteBulkResponse } from '../models/QuestionCreateUpdateDeleteBulkResponse';
import type { QuestionResponse } from '../models/QuestionResponse';
import type { QuestionSetRequest } from '../models/QuestionSetRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class QuestionService {
    /**
     * Get Questions By Set Ids
     * @returns QuestionResponse Successful Response
     * @throws ApiError
     */
    public static questionGetQuestionsBySetIds({
        requestBody,
    }: {
        requestBody: Array<QuestionSetRequest>,
    }): CancelablePromise<Array<QuestionResponse>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/questions/question_set_ids',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Questions
     * @returns QuestionCreateUpdateDeleteBulkResponse Successful Response
     * @throws ApiError
     */
    public static questionUpdateQuestions({
        formData,
    }: {
        formData: Body_Question_update_questions,
    }): CancelablePromise<QuestionCreateUpdateDeleteBulkResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/question_set/question/bulk',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
