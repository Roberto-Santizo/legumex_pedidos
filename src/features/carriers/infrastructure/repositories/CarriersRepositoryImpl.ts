// Created by Luis

import type { CarriersDatasource } from '@/features/carriers/carriers';
import type { CarriersRepository } from '../../domain/repositories/CarriersRepository';
import type { CreateCarrierPayload, UpdateCarrierPayload } from '../../domain/interfaces/interfaces';
import type { Carrier } from '../../domain/types/types';

export class CarriersRepositoryImpl implements CarriersRepository {
    constructor(private datasource: CarriersDatasource) {}

    getAll(): Promise<Carrier[]> { return this.datasource.getAll(); }
    create(payload: CreateCarrierPayload): Promise<Carrier> { return this.datasource.create(payload); }
    update(id: number, payload: UpdateCarrierPayload): Promise<Carrier> { return this.datasource.update(id, payload); }
    delete(id: number): Promise<void> { return this.datasource.delete(id); }
}
