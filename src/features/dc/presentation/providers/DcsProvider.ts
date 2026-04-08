import type { Dc, DcRepository } from "@/features/dc/dc";

export class DcsProvider {
    constructor(private repository: DcRepository) { }

    async getDcs(client_id: string): Promise<Dc[]> {
        return this.repository.getDcs(client_id);
    }
} 