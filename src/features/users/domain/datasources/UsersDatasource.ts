import type { CreateOrUpdateUserPayload, FiltersUsers, PaginatedUsers, User } from "../domain";

export abstract class UsersDatasource {
    abstract createUser(payload: CreateOrUpdateUserPayload): Promise<string>;
    abstract getUsers(): Promise<User[]>;
    abstract getPaginatedUsers({ limit, offset, filters }: { limit: number, offset: number, filters: FiltersUsers }): Promise<PaginatedUsers>;
}
