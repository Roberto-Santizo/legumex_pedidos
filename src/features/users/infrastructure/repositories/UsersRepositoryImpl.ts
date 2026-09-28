import { UsersDatasource, UsersRepository, type CreateOrUpdateUserPayload, type FiltersUsers, type PaginatedUsers, type User } from '@/features/users/users';

export class UsersRepositoryImpl implements UsersRepository {

    constructor(private datasource: UsersDatasource) { }

    getUsers(): Promise<User[]> {
        return this.datasource.getUsers();
    }

    getPaginatedUsers({ limit, offset, filters }: { limit: number, offset: number, filters: FiltersUsers }): Promise<PaginatedUsers> {
        return this.datasource.getPaginatedUsers({ limit, offset, filters });
    }

    createUser(payload: CreateOrUpdateUserPayload): Promise<string> {
        return this.datasource.createUser(payload);
    }

}
