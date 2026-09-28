import type { Dc, CreateOrUpdateDc, FiltersDcs, PaginatedDcs } from "@/features/dc/dc";

export abstract class DcDatasource {
    abstract createDc(payload: CreateOrUpdateDc): Promise<string>;
    abstract getDcs(client_id: string): Promise<Dc[]>;
    abstract getAllDcs(): Promise<Dc[]>;
    abstract getPaginatedDcs({ limit, offset, filters }: { limit: number, offset: number, filters: FiltersDcs }): Promise<PaginatedDcs>;
}
