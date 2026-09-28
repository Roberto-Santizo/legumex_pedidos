import { type Client, type FiltersClients, type PaginatedClients, ClientDatasource, ClientRepository } from '../../domain/domain';

export class ClientRepositoryImpl implements ClientRepository {
    constructor(private datasource: ClientDatasource) { }
    
    getUserClients(): Promise<Client[]> {
        return this.datasource.getUserClients();
    }

    createClient(name: string, code: string): Promise<string> {
        return this.datasource.createClient(name, code);
    }

    getClients(): Promise<Client[]> {
        return this.datasource.getClients();
    }

    getPaginatedClients({ limit, offset, filters }: { limit: number, offset: number, filters: FiltersClients }): Promise<PaginatedClients> {
        return this.datasource.getPaginatedClients({ limit, offset, filters });
    }

    getClientById(id: string): Promise<Client> {
        return this.datasource.getClientById(id);
    }

    updateClientById({ id, name }: { id: string; name: string; }): Promise<string> {
        return this.datasource.updateClientById({ id, name });
    }

}