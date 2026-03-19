import { AddItemsToOrder, MyOrders } from "@/features/my-orders/my-orders";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CreateProduct, Products, UpdateProduct } from "@/features/products/products";
import { Home } from "@/features/home/home";
import { Login } from "@/features/login/login";
import { Profile } from "@/features/profile/profile";
import { ProtectedLayout, PublicLayout } from "@/features/shared/shared";

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
                    <Route path="/my-orders/addItems/:id" element={<AddItemsToOrder />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/create" element={<CreateProduct />} />
                    <Route path="/products/update/:id" element={<UpdateProduct />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
