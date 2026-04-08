import type { CreateOrUpdateDc, Dc, DcRepository } from "@/features/dc/dc";

export class DcsProvider {
    constructor(private repository: DcRepository) { }

    async createDc(payload: CreateOrUpdateDc){
        return this.repository.createDc(payload);
    }

    async getDcs(client_id: string): Promise<Dc[]> {
        return this.repository.getDcs(client_id);
    }
} 