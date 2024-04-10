/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TicketEachSummaryResponse } from '../models/TicketEachSummaryResponse';
import type { TicketSummaryResponse } from '../models/TicketSummaryResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SummaryService {
    /**
     * Get Summary
     * @returns TicketSummaryResponse Successful Response
     * @throws ApiError
     */
    public static summaryGetSummary({
        limit,
        startAt,
    }: {
        limit?: (number | null),
        startAt?: (number | null),
    }): CancelablePromise<TicketSummaryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/summary',
            query: {
                'limit': limit,
                'start_at': startAt,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Summary By Ticket Id
     * @returns TicketEachSummaryResponse Successful Response
     * @throws ApiError
     */
    public static summaryGetSummaryByTicketId({
        ticketId,
    }: {
        ticketId: number,
    }): CancelablePromise<TicketEachSummaryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/summary/{ticket_id}',
            path: {
                'ticket_id': ticketId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
