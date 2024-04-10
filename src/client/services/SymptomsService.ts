/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SymptomCreateBody } from '../models/SymptomCreateBody';
import type { SymptomRead } from '../models/SymptomRead';
import type { SymptomResponse } from '../models/SymptomResponse';
import type { SymptomUpdate } from '../models/SymptomUpdate';
import type { SymptomWithQuestions } from '../models/SymptomWithQuestions';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SymptomsService {
    /**
     * Get Symptoms
     * @returns SymptomRead Successful Response
     * @throws ApiError
     */
    public static symptomsGetSymptoms(): CancelablePromise<Array<SymptomRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/symptoms',
        });
    }
    /**
     * Get Symptoms By Animal Id
     * @returns SymptomWithQuestions Successful Response
     * @throws ApiError
     */
    public static symptomsGetSymptomsByAnimalId({
        animalId,
    }: {
        animalId: number,
    }): CancelablePromise<Array<SymptomWithQuestions>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/symptoms/animal/{animal_id}',
            path: {
                'animal_id': animalId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Symptom
     * @returns SymptomUpdate Successful Response
     * @throws ApiError
     */
    public static symptomsUpdateSymptom({
        requestBody,
    }: {
        requestBody: SymptomRead,
    }): CancelablePromise<SymptomUpdate> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/symptom',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Symptom
     * @returns SymptomResponse Successful Response
     * @throws ApiError
     */
    public static symptomsAddSymptom({
        requestBody,
    }: {
        requestBody: SymptomCreateBody,
    }): CancelablePromise<SymptomResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/symptom',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remove Symptom
     * @returns SymptomResponse Successful Response
     * @throws ApiError
     */
    public static symptomsRemoveSymptom({
        symptomId,
    }: {
        symptomId: number,
    }): CancelablePromise<SymptomResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/symptom/{symptom_id}',
            path: {
                'symptom_id': symptomId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
