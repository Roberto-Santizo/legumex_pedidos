// Created by Luis

import type { ContainersDatasource } from '@/features/containers/containers';
import type { ContainersRepository } from '../../domain/repositories/ContainersRepository';
import type { CreateContainerPayload } from '../../domain/interfaces/interfaces';
import type { ContainerDetail, WeekView } from '../../domain/types/types';

export class ContainersRepositoryImpl implements ContainersRepository {
    constructor(private datasource: ContainersDatasource) {}

    getWeekView(date: string): Promise<WeekView> {
        return this.datasource.getWeekView(date);
    }

    createContainer(payload: CreateContainerPayload): Promise<{ message: string; id: number }> {
        return this.datasource.createContainer(payload);
    }

    addOrdersToContainer(containerId: number, orderIds: number[]): Promise<string> {
        return this.datasource.addOrdersToContainer(containerId, orderIds);
    }

    removeOrderFromContainer(containerId: number, orderId: number): Promise<string> {
        return this.datasource.removeOrderFromContainer(containerId, orderId);
    }

    confirmContainer(containerId: number): Promise<{ message: string; warning: string | null }> {
        return this.datasource.confirmContainer(containerId);
    }

    deleteContainer(containerId: number): Promise<string> {
        return this.datasource.deleteContainer(containerId);
    }

    getContainerById(containerId: number): Promise<ContainerDetail> {
        return this.datasource.getContainerById(containerId);
    }

    assignCarrier(containerId: number, carrierId: number): Promise<ContainerDetail> {
        return this.datasource.assignCarrier(containerId, carrierId);
    }

    setDeliverySchedule(containerId: number, deliveryDate: string, deliveryTime: string): Promise<ContainerDetail> {
        return this.datasource.setDeliverySchedule(containerId, deliveryDate, deliveryTime);
    }
}
