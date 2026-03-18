import type { User, LoginForm } from "@/features/login/login";

export abstract class AuthDatasource {
    abstract login(data: LoginForm): Promise<User>;
    abstract refreshToken(): Promise<User>;
}