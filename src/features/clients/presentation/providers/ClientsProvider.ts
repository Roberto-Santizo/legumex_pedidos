import type { ClientRepository } from "../../clients";

export class ClientsProvider {
    constructor(private repository: ClientRepository) { }

    async createClient(name: string) {
        return this.repository.createClient(name);
    }

    async getClients() {
        return this.repository.getClients();
    }

    async getClientById(id: string) {
        return this.repository.getClientById(id);
    }

    async updateClientById({ id, name }: { id: string, name: string }) {
        return this.repository.updateClientById({ id, name });
    }
}