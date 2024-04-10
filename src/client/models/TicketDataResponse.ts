/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SymptomSummary } from './SymptomSummary';
import type { TicketInfo } from './TicketInfo';
export type TicketDataResponse = {
    ticketId: number;
    info: Array<TicketInfo>;
    summary: Array<SymptomSummary>;
};

