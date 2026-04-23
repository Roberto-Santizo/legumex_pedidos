// Created by Luis

import type { CreateContainerPayload } from '../interfaces/interfaces';
import type { ContainerDetail, WeekView } from '../types/types';

export abstract class ContainersRepository {
    abstract getWeekView(date: string): Promise<WeekView>;
    abstract createContainer(payload: CreateContainerPayload): Promise<{ message: string; id: number }>;
    abstract addOrdersToContainer(containerId: number, orderIds: number[]): Promise<string>;
    abstract removeOrderFromContainer(containerId: number, orderId: number): Promise<string>;
    abstract confirmContainer(containerId: number): Promise<{ message: string; warning: string | null }>;
    abstract deleteContainer(containerId: number): Promise<string>;
    abstract getContainerById(containerId: number): Promise<ContainerDetail>;
    abstract assignCarrier(containerId: number, carrierId: number): Promise<ContainerDetail>;
}
