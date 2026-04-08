import type { Dc, CreateOrUpdateDc } from "@/features/dc/dc";

export abstract class DcDatasource {
    abstract createDc(payload: CreateOrUpdateDc): Promise<string>;
    abstract getDcs(client_id: string): Promise<Dc[]>;
}