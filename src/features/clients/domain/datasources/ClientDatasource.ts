import type { FiltersClients } from "../interfaces/interfaces";
import type { Client, PaginatedClients } from "../types/type";

export abstract class ClientDatasource {
    abstract createClient(name: string, code: string): Promise<string>;
    abstract getClients(): Promise<Client[]>;
    abstract getPaginatedClients({ limit, offset, filters }: { limit: number, offset: number, filters: FiltersClients }): Promise<PaginatedClients>;
    abstract getClientById(id: string): Promise<Client>;
    abstract getUserClients(): Promise<Client[]>;
    abstract updateClientById({ id, name }: { id: string, name: string }): Promise<string>;
}
