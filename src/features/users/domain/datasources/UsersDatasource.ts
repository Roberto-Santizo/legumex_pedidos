import type { CreateOrUpdateUserPayload, User } from "../domain";

export abstract class UsersDatasource {
    abstract createUser(payload: CreateOrUpdateUserPayload): Promise<string>;
    abstract getUsers(): Promise<User[]>;
}