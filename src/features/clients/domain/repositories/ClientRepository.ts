import type { Client } from "../types/type";

export abstract class ClientRepository {
    abstract createClient(name: string, code: string): Promise<string>;
    abstract getClients(): Promise<Client[]>;
    abstract getClientById(id: string): Promise<Client>;
    abstract getUserClients(): Promise<Client[]>;
    abstract updateClientById({ id, name }: { id: string, name: string }): Promise<string>;
}