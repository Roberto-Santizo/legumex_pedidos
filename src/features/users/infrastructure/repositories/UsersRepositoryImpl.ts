import { UsersDatasource, UsersRepository, type CreateOrUpdateUserPayload, type User } from '@/features/users/users';

export class UsersRepositoryImpl implements UsersRepository {

    constructor(private datasource: UsersDatasource) { }

    getUsers(): Promise<User[]> {
        return this.datasource.getUsers();
    }

    createUser(payload: CreateOrUpdateUserPayload): Promise<string> {
        return this.datasource.createUser(payload);
    }

}