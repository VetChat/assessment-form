/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BreedCreate } from '../models/BreedCreate';
import type { BreedCreateUpdateResponse } from '../models/BreedCreateUpdateResponse';
import type { BreedRead } from '../models/BreedRead';
import type { BreedUpdate } from '../models/BreedUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BreedsService {
    /**
     * Get Breed By Animal Id
     * @returns BreedRead Successful Response
     * @throws ApiError
     */
    public static breedsGetBreedByAnimalId({
        animalId,
    }: {
        animalId: number,
    }): CancelablePromise<Array<BreedRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/animal/{animal_id}/breeds',
            path: {
                'animal_id': animalId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Breed
     * @returns BreedCreateUpdateResponse Successful Response
     * @throws ApiError
     */
    public static breedsUpdateBreed({
        requestBody,
    }: {
        requestBody: BreedUpdate,
    }): CancelablePromise<BreedCreateUpdateResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/animal/breed',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Breed
     * @returns BreedCreateUpdateResponse Successful Response
     * @throws ApiError
     */
    public static breedsAddBreed({
        requestBody,
    }: {
        requestBody: BreedCreate,
    }): CancelablePromise<BreedCreateUpdateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/animal/breed',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remove Breed
     * @returns BreedCreateUpdateResponse Successful Response
     * @throws ApiError
     */
    public static breedsRemoveBreed({
        breedId,
    }: {
        breedId: number,
    }): CancelablePromise<BreedCreateUpdateResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/animal/breed/{breed_id}',
            path: {
                'breed_id': breedId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
