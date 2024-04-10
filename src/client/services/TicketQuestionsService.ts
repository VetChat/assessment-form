/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TicketQuestionRead } from '../models/TicketQuestionRead';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TicketQuestionsService {
    /**
     * Get Ticket Questions
     * @returns TicketQuestionRead Successful Response
     * @throws ApiError
     */
    public static ticketQuestionsGetTicketQuestions(): CancelablePromise<Array<TicketQuestionRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ticket_questions',
        });
    }
}
