import type { CreateOrUpdateDc, Dc, FiltersDcs, PaginatedDcs } from "@/features/dc/dc";

export abstract class DcRepository {
    abstract createDc(payload: CreateOrUpdateDc): Promise<string>;
    abstract getDcs(client_id: string): Promise<Dc[]>;
    abstract getAllDcs(): Promise<Dc[]>;
    abstract getPaginatedDcs({ limit, offset, filters }: { limit: number, offset: number, filters: FiltersDcs }): Promise<PaginatedDcs>;
}
