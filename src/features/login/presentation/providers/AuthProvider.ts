import type { AuthRepository, LoginForm, User } from "@/features/login/login";

export class AuthProvider {
    constructor(private repository: AuthRepository) { }

    async login(payload: LoginForm): Promise<User> {
        const user = await this.repository.login(payload);
        return user;
    }

    async refreshToken(): Promise<User> {
        const user = await this.repository.refreshToken();
        return user;
    }
}