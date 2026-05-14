// Created by Luis

import type { ContainersRepository } from '../../domain/repositories/ContainersRepository';
import type { CreateContainerPayload } from '../../domain/interfaces/interfaces';
import type { ContainerDetail, WeekView } from '../../domain/types/types';

export class ContainersProvider {
    constructor(private repository: ContainersRepository) {}

    getWeekView(date: string): Promise<WeekView> {
        return this.repository.getWeekView(date);
    }

    createContainer(payload: CreateContainerPayload): Promise<{ message: string; id: number }> {
        return this.repository.createContainer(payload);
    }

    addOrdersToContainer(containerId: number, orderIds: number[]): Promise<string> {
        return this.repository.addOrdersToContainer(containerId, orderIds);
    }

    removeOrderFromContainer(containerId: number, orderId: number): Promise<string> {
        return this.repository.removeOrderFromContainer(containerId, orderId);
    }

    confirmContainer(containerId: number): Promise<{ message: string; warning: string | null }> {
        return this.repository.confirmContainer(containerId);
    }

    deleteContainer(containerId: number): Promise<string> {
        return this.repository.deleteContainer(containerId);
    }

    getContainerById(containerId: number): Promise<ContainerDetail> {
        return this.repository.getContainerById(containerId);
    }

    assignCarrier(containerId: number, carrierId: number): Promise<ContainerDetail> {
        return this.repository.assignCarrier(containerId, carrierId);
    }

    setDeliverySchedule(containerId: number, deliveryDate: string, deliveryTime: string): Promise<ContainerDetail> {
        return this.repository.setDeliverySchedule(containerId, deliveryDate, deliveryTime);
    }
}
