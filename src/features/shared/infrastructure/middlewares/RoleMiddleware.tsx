import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/config/config";

type Props = {
    allowedRoles: string[];
}

export function RoleMiddleware({ allowedRoles }: Props) {
    const user = useSelector((state: RootState) => state.auth.user)!;

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to={'/home'} replace />
    }
    return (
        <Outlet />
    )
}
