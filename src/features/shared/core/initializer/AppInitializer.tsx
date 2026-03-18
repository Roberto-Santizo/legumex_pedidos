import { authRepositoryProvider, logout, login } from '@/features/login/login';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const AppInitializer = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = localStorage.getItem("AUTH_TOKEN");
                const refreshToken = localStorage.getItem("REFRESH_TOKEN");

                if (!token && !refreshToken) {
                    dispatch(logout());
                    return;
                }

                const user = await authRepositoryProvider.refreshToken();
                dispatch(login(user));
            } catch (error) {
                dispatch(logout());
            } finally {
                setLoading(false);
            }
        }
        initAuth();
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
}


