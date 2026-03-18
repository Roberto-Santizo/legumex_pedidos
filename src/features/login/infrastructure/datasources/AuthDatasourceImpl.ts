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
            throw new Error("Información no válida");
        } catch (error) {
            throw new Error("Error no controlado");
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
            throw new Error("Información no válida");
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data['statusCode'] == 409) throw new Error(error.response.data['message']);
                if (error.response?.data['statusCode'] == 404) throw new Error(error.response.data['message']);
            }
            throw new Error("Error no controlado");
        }
    }

}