import { type CreateOrUpdateDc, type Dc, DcDatasource, DcRepository } from '@/features/dc/dc';

export class DcRepositoryImpl implements DcRepository {

    constructor(private datasource: DcDatasource) { }

    getDcs(client_id: string): Promise<Dc[]> {
        return this.datasource.getDcs(client_id);
    }

    createDc(payload: CreateOrUpdateDc): Promise<string> {
        return this.datasource.createDc(payload);
    }
}