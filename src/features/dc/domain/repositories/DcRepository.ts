import type { CreateOrUpdateDc, Dc } from "@/features/dc/dc";

export abstract class DcRepository {
    abstract createDc(payload: CreateOrUpdateDc): Promise<string>;
    abstract getDcs(client_id: string): Promise<Dc[]>;
}