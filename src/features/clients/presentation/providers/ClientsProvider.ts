import type { ClientRepository } from "../../clients";

export class ClientsProvider {
    constructor(private repository: ClientRepository) { }

    async createClient(name: string, code: string) {
        return this.repository.createClient(name, code);
    }

    async getClients() {
        return this.repository.getClients();
    }

    async getUserClients() {
        return this.repository.getUserClients();
    }

    async getClientById(id: string) {
        return this.repository.getClientById(id);
    }

    async updateClientById({ id, name }: { id: string, name: string }) {
        return this.repository.updateClientById({ id, name });
    }
}