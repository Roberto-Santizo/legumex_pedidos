// Created by Luis

import { isAxiosError, type AxiosInstance } from 'axios';
import { CarriersDatasource, CarrierListResponseSchema, CarrierResponseSchema, CarrierRateListResponseSchema } from '@/features/carriers/carriers';
import type { CreateCarrierPayload, UpdateCarrierPayload } from '../../domain/interfaces/interfaces';
import type { Carrier, CarrierRate } from '../../domain/types/types';
import { CarrierNotFoundError } from '../errors/errors';

export class CarriersDatasourceImpl implements CarriersDatasource {
    constructor(private api: AxiosInstance) {}

    async getAll(): Promise<Carrier[]> {
        try {
            const { data } = await this.api.get('/carriers');
            // console.log('[CarriersDatasource] raw response sample:', JSON.stringify(data?.data?.[0], null, 2));
            const parsed = CarrierListResponseSchema.safeParse(data);
            if (parsed.success) return parsed.data.data;
            // console.error('[CarriersDatasource] parse errors:', JSON.stringify(parsed.error.issues, null, 2));
            throw new Error('Invalid response from server');
        } catch (error) {
            if (isAxiosError(error)) throw new Error(error.response?.data?.message ?? 'Connection error');
            if (error instanceof Error) throw error;
            throw new Error('Unexpected error');
        }
    }

    async getByDcId(dcId: number): Promise<Carrier[]> {
        try {
            const { data } = await this.api.get(`/carriers?dc_id=${dcId}`);
            const parsed = CarrierListResponseSchema.safeParse(data);
            if (parsed.success) return parsed.data.data;
            throw new Error('Invalid response from server');
        } catch (error) {
            if (isAxiosError(error)) throw new Error(error.response?.data?.message ?? 'Connection error');
            if (error instanceof Error) throw error;
            throw new Error('Unexpected error');
        }
    }

    async create(payload: CreateCarrierPayload): Promise<Carrier> {
        try {
            const { data } = await this.api.post('/carriers', payload);
            const parsed = CarrierResponseSchema.safeParse(data);
            if (parsed.success) return parsed.data.data;
            throw new Error('Invalid response from server');
        } catch (error) {
            if (isAxiosError(error)) throw new Error(error.response?.data?.message ?? 'Connection error');
            if (error instanceof Error) throw error;
            throw new Error('Unexpected error');
        }
    }

    async update(id: number, payload: UpdateCarrierPayload): Promise<Carrier> {
        try {
            const { data } = await this.api.put(`/carriers/${id}`, payload);
            const parsed = CarrierResponseSchema.safeParse(data);
            if (parsed.success) return parsed.data.data;
            throw new Error('Invalid response from server');
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data?.statusCode === 404) throw new CarrierNotFoundError(error.response.data.message);
                throw new Error(error.response?.data?.message ?? 'Connection error');
            }
            if (error instanceof Error) throw error;
            throw new Error('Unexpected error');
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await this.api.delete(`/carriers/${id}`);
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data?.statusCode === 404) throw new CarrierNotFoundError(error.response.data.message);
                throw new Error(error.response?.data?.message ?? 'Connection error');
            }
            throw new Error('Unexpected error');
        }
    }

    async getRates(carrierId: number): Promise<CarrierRate[]> {
        try {
            const { data } = await this.api.get(`/carriers/${carrierId}/rates`);
            const parsed = CarrierRateListResponseSchema.safeParse(data);
            if (parsed.success) return parsed.data.data;
            throw new Error('Invalid response from server');
        } catch (error) {
            if (isAxiosError(error)) throw new Error(error.response?.data?.message ?? 'Connection error');
            if (error instanceof Error) throw error;
            throw new Error('Unexpected error');
        }
    }
}
