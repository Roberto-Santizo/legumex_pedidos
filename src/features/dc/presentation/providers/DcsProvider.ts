import type { CreateOrUpdateDc, Dc, DcRepository, FiltersDcs } from "@/features/dc/dc";

export class DcsProvider {
    constructor(private repository: DcRepository) { }

    async createDc(payload: CreateOrUpdateDc){
        return this.repository.createDc(payload);
    }

    async getDcs(client_id: string): Promise<Dc[]> {
        return this.repository.getDcs(client_id);
    }

    async getAllDcs(): Promise<Dc[]> {
        return this.repository.getAllDcs();
    }

    async getPaginatedDcs({ limit, offset, filters }: { limit: number, offset: number, filters: FiltersDcs }) {
        return this.repository.getPaginatedDcs({ limit, offset, filters });
    }
} 
