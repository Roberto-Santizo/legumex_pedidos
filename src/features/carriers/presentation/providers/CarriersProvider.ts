// Created by Luis

import type { CarriersRepository } from '../../domain/repositories/CarriersRepository';
import type { CreateCarrierPayload, UpdateCarrierPayload } from '../../domain/interfaces/interfaces';
import type { Carrier } from '../../domain/types/types';

export class CarriersProvider {
    constructor(private repository: CarriersRepository) {}

    getAll(): Promise<Carrier[]> { return this.repository.getAll(); }
    getByDcId(dcId: number): Promise<Carrier[]> { return this.repository.getByDcId(dcId); }
    create(payload: CreateCarrierPayload): Promise<Carrier> { return this.repository.create(payload); }
    update(id: number, payload: UpdateCarrierPayload): Promise<Carrier> { return this.repository.update(id, payload); }
    delete(id: number): Promise<void> { return this.repository.delete(id); }
    getRates(carrierId: number) { return this.repository.getRates(carrierId); }
}
