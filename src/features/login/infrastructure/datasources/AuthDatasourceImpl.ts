import { AuthDatasource, UserSchema, type LoginForm, type User } from '@/features/login/login';
import { isAxiosError, type AxiosInstance } from 'axios';

export class AuthDatasourceImpl implements AuthDatasource {

    constructor(private api: AxiosInstance) { }

    async refreshToken(): Promise<User> {
        try {
            const url = '/auth/check-status';
            const { data } = await this.api.get(url);
            const response = UserSchema.safeParse(data['data']);
            if (response.success) {
                return response.data;
            }
            throw new Error("Invalid data");
        } catch (error) {
            throw new Error("Unhandled error");
        }
    }

    async login(payload: LoginForm): Promise<User> {
        try {
            const url = '/auth/login';
            const { data } = await this.api.post(url, payload);
            const response = UserSchema.safeParse(data['data']);
            if (response.success) {
                return response.data;
            }
            throw new Error("Invalid data");
        } catch (error) {
            if (isAxiosError(error)) {
                const status = error.response?.status;
                const body = error.response?.data;
                if (status === 400 && body?.errors) throw new Error(body.errors.join(', '));
                if (body?.statusCode === 401) throw new Error(body.message);
                if (body?.statusCode === 404) throw new Error(body.message);
                if (body?.statusCode === 409) throw new Error(body.message);
            }
            throw new Error("Unhandled error");
        }
    }

}
