import { type CreateOrUpdateDc, type Dc, type FiltersDcs, type PaginatedDcs, DcDatasource, DcRepository } from '@/features/dc/dc';

export class DcRepositoryImpl implements DcRepository {

    constructor(private datasource: DcDatasource) { }

    getDcs(client_id: string): Promise<Dc[]> {
        return this.datasource.getDcs(client_id);
    }

    getAllDcs(): Promise<Dc[]> {
        return this.datasource.getAllDcs();
    }

    getPaginatedDcs({ limit, offset, filters }: { limit: number, offset: number, filters: FiltersDcs }): Promise<PaginatedDcs> {
        return this.datasource.getPaginatedDcs({ limit, offset, filters });
    }

    createDc(payload: CreateOrUpdateDc): Promise<string> {
        return this.datasource.createDc(payload);
    }
}
