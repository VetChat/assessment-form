/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnimalCreate } from '../models/AnimalCreate';
import type { AnimalRead } from '../models/AnimalRead';
import type { AnimalResponse } from '../models/AnimalResponse';
import type { AnimalUpdate } from '../models/AnimalUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AnimalsService {
    /**
     * Get Animal
     * @returns AnimalRead Successful Response
     * @throws ApiError
     */
    public static animalsGetAnimal(): CancelablePromise<Array<AnimalRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/animals',
        });
    }
    /**
     * Get Animal By Id
     * @returns AnimalRead Successful Response
     * @throws ApiError
     */
    public static animalsGetAnimalById({
        animalId,
    }: {
        animalId: number,
    }): CancelablePromise<AnimalRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/animal/{animal_id}',
            path: {
                'animal_id': animalId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remove Animal
     * @returns AnimalResponse Successful Response
     * @throws ApiError
     */
    public static animalsRemoveAnimal({
        animalId,
    }: {
        animalId: number,
    }): CancelablePromise<AnimalResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/animal/{animal_id}',
            path: {
                'animal_id': animalId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Animal
     * @returns AnimalUpdate Successful Response
     * @throws ApiError
     */
    public static animalsUpdateAnimal({
        requestBody,
    }: {
        requestBody: AnimalRead,
    }): CancelablePromise<AnimalUpdate> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/animal',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Animal
     * @returns AnimalResponse Successful Response
     * @throws ApiError
     */
    public static animalsAddAnimal({
        requestBody,
    }: {
        requestBody: AnimalCreate,
    }): CancelablePromise<AnimalResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/animal',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
