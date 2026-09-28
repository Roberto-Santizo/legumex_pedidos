import { UsersDatasource, type CreateOrUpdateUserPayload, NotFound, ConflictError, type User, UsersResponseSchema, PaginatedUsersResponseSchema, type FiltersUsers, type PaginatedUsers } from '@/features/users/users';
import { isAxiosError, type AxiosInstance } from 'axios';

export class UsersDatasourceImpl implements UsersDatasource {
    constructor(private api: AxiosInstance) { }

    async getUsers(): Promise<User[]> {
        try {
            const url = '/auth/getUsers';
            const { data } = await this.api.get(url);
            const response = UsersResponseSchema.safeParse(data);

            if (response.success) {
                return response.data.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data['statusCode'] == 409) throw new ConflictError(error.response.data['message'])
            }

            throw new Error("Error no controlado");
        }
    }

    async getPaginatedUsers({ limit, offset, filters }: { limit: number, offset: number, filters: FiltersUsers }): Promise<PaginatedUsers> {
        try {
            const params = new URLSearchParams({ limit: String(limit), offset: String(offset), ...filters });
            const url = `/auth/getPaginatedUsers?${params}`;
            const { data } = await this.api.get(url);
            const response = PaginatedUsersResponseSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data['message']);
            }
            throw new Error("Error no controlado");
        }
    }

    async createUser(payload: CreateOrUpdateUserPayload): Promise<string> {
        try {
            const url = '/auth/register';
            const { data } = await this.api.post(url, payload);

            return data['message'];
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data['statusCode'] == 404) throw new NotFound(error.response.data['message'])
                if (error.response?.data['statusCode'] == 409) throw new ConflictError(error.response.data['message'])
            }

            throw new Error("Error no controlado");
        }
    }

}