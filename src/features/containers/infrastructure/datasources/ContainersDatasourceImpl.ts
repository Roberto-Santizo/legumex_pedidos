// Created by Luis

import { isAxiosError, type AxiosInstance } from 'axios';
import {
    ContainerDetailResponseSchema,
    ContainersDatasource,
    WeekViewResponseSchema,
    type ContainerDetail,
    type CreateContainerPayload,
    type WeekView,
} from '@/features/containers/containers';
import { ContainerNotFoundError } from '../errors/errors';

export class ContainersDatasourceImpl implements ContainersDatasource {
    constructor(private api: AxiosInstance) {}

    async getWeekView(date: string): Promise<WeekView> {
        try {
            const { data } = await this.api.get(`/containers/week?date=${date}`);
            const parsed = WeekViewResponseSchema.safeParse(data);

            if (parsed.success) return parsed.data.data;
            throw new Error('Invalid response from server');
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data?.statusCode === 404)
                    throw new ContainerNotFoundError(error.response.data.message);
                throw new Error(error.response?.data?.message ?? 'Connection error');
            }
            if (error instanceof Error) throw error;
            throw new Error('Unexpected error');
        }
    }

    async createContainer(payload: CreateContainerPayload): Promise<{ message: string; id: number }> {
        try {
            const { data } = await this.api.post('/containers', payload);
            // The backend returns the created Container entity under data.data
            return { message: data['message'], id: data['data']['id'] as number };
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data?.message ?? 'Connection error');
            }
            throw new Error('Unexpected error');
        }
    }

    async addOrdersToContainer(containerId: number, orderIds: number[]): Promise<string> {
        try {
            const { data } = await this.api.post(`/containers/${containerId}/orders`, { orderIds });
            return data['message'];
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data?.message ?? 'Connection error');
            }
            throw new Error('Unexpected error');
        }
    }

    async removeOrderFromContainer(containerId: number, orderId: number): Promise<string> {
        try {
            const { data } = await this.api.delete(`/containers/${containerId}/orders/${orderId}`);
            return data['message'];
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data?.statusCode === 404)
                    throw new ContainerNotFoundError(error.response.data.message);
                throw new Error(error.response?.data?.message ?? 'Connection error');
            }
            throw new Error('Unexpected error');
        }
    }

    async confirmContainer(containerId: number): Promise<{ message: string; warning: string | null }> {
        try {
            const { data } = await this.api.post(`/containers/${containerId}/confirm`);
            return {
                message: data['message'],
                // The backend optionally returns a warning when weight < 20,000 lbs
                warning: data['data']?.warning ?? null,
            };
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data?.statusCode === 404)
                    throw new ContainerNotFoundError(error.response.data.message);
                throw new Error(error.response?.data?.message ?? 'Connection error');
            }
            throw new Error('Unexpected error');
        }
    }

    async deleteContainer(containerId: number): Promise<string> {
        try {
            const { data } = await this.api.delete(`/containers/${containerId}`);
            return data['message'];
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data?.statusCode === 404)
                    throw new ContainerNotFoundError(error.response.data.message);
                throw new Error(error.response?.data?.message ?? 'Connection error');
            }
            throw new Error('Unexpected error');
        }
    }

    async getContainerById(containerId: number): Promise<ContainerDetail> {
        try {
            const { data } = await this.api.get(`/containers/${containerId}`);
            const parsed = ContainerDetailResponseSchema.safeParse(data);

            if (parsed.success) return parsed.data.data;
            throw new Error('Invalid response from server');
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data?.statusCode === 404)
                    throw new ContainerNotFoundError(error.response.data.message);
                throw new Error(error.response?.data?.message ?? 'Connection error');
            }
            if (error instanceof Error) throw error;
            throw new Error('Unexpected error');
        }
    }

    async assignCarrier(containerId: number, carrierId: number): Promise<ContainerDetail> {
        try {
            const { data } = await this.api.post(`/containers/${containerId}/assign-carrier`, { carrierId });
            const parsed = ContainerDetailResponseSchema.safeParse(data);

            if (parsed.success) return parsed.data.data;
            throw new Error('Invalid response from server');
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data?.statusCode === 404)
                    throw new ContainerNotFoundError(error.response.data.message);
                throw new Error(error.response?.data?.message ?? 'Connection error');
            }
            if (error instanceof Error) throw error;
            throw new Error('Unexpected error');
        }
    }
}
