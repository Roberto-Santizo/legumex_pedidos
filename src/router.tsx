import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedLayout, PublicLayout } from "@/features/shared/shared";
import { Login } from "@/features/login/login";
import { Home } from "@/features/home/home";
import { MyOrders } from "@/features/my-orders/my-orders";
import { Profile } from "@/features/profile/profile";


export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Navigate to={'/login'} replace />} />
                    <Route path="/login" element={<Login />} />
                </Route>

                <Route element={<ProtectedLayout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/my-orders" element={<MyOrders />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
