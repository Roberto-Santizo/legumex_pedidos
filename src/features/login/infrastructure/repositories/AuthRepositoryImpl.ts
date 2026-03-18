import { AuthRepository, type AuthDatasource, type LoginForm, type User } from '@/features/login/login';

export class AuthRepositoryImpl implements AuthRepository {
    constructor(private datasource: AuthDatasource) { }
    refreshToken(): Promise<User> {
        return this.datasource.refreshToken();
    }

    login(data: LoginForm): Promise<User> {
        return this.datasource.login(data);
    }

}