/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TicketCreate } from '../models/TicketCreate';
import type { TicketId } from '../models/TicketId';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TicketsService {
    /**
     * Create Ticket
     * @returns TicketId Successful Response
     * @throws ApiError
     */
    public static ticketsCreateTicket({
        requestBody,
    }: {
        requestBody: TicketCreate,
    }): CancelablePromise<TicketId> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tickets',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
