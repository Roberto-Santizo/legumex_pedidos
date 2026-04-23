// Created by Luis

import type { CreateCarrierPayload, UpdateCarrierPayload } from '../interfaces/interfaces';
import type { Carrier } from '../types/types';

export abstract class CarriersRepository {
    abstract getAll(): Promise<Carrier[]>;
    abstract create(payload: CreateCarrierPayload): Promise<Carrier>;
    abstract update(id: number, payload: UpdateCarrierPayload): Promise<Carrier>;
    abstract delete(id: number): Promise<void>;
}
