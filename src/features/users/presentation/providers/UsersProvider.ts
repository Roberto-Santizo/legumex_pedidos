import { UsersDatasourceImpl, UsersRepositoryImpl } from "@/features/users/infrastructure/infrastructure";
import { type CreateOrUpdateUserPayload, type FiltersUsers, type UsersRepository  } from "@/features/users/domain/domain";

import api from "@/config/http/axios";

export class UsersProvider {
    constructor(private repository: UsersRepository) { }

    async createUser(payload: CreateOrUpdateUserPayload) {
        return this.repository.createUser(payload);
    }

    async getUsers() {
        return this.repository.getUsers();
    }

    async getPaginatedUsers({ limit, offset, filters }: { limit: number, offset: number, filters: FiltersUsers }) {
        return this.repository.getPaginatedUsers({ limit, offset, filters });
    }
}

const datasource = new UsersDatasourceImpl(api);
const repository = new UsersRepositoryImpl(datasource);
export const usersProvider = new UsersProvider(repository);