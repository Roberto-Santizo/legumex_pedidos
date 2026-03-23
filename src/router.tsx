import { AddItemsToOrder, MyOrder, MyOrders } from "@/features/my-orders/my-orders";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CreateProduct, Products, UpdateProduct } from "@/features/products/products";
import { Home } from "@/features/home/home";
import { Login } from "@/features/login/login";
import { Profile } from "@/features/profile/profile";
import { ProtectedLayout, PublicLayout, RoleMiddleware } from "@/features/shared/shared";
import { Clients, CreateClient, UpdateClient } from "@/features/clients/clients";
import { CreateUser, UpdateUser, Users } from "@/features/users/users";

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

                    //ORDERS
                    <Route path="/my-orders" element={<MyOrders />} />
                    <Route path="/my-orders/addItems/:id" element={<AddItemsToOrder />} />
                    <Route path="/my-orders/:id" element={<MyOrder />} />

                    //PROFILE
                    <Route path="/profile" element={<Profile />} />

                    //PRODUCTS
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/create" element={<CreateProduct />} />
                    <Route path="/products/update/:id" element={<UpdateProduct />} />

                    //CLIENTS
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/clients/create" element={<CreateClient />} />
                    <Route path="/clients/update/:id" element={<UpdateClient />} />

                    //USERS
                    <Route element={<RoleMiddleware allowedRoles={['admin']} />}>
                        <Route path="/users" element={<Users />} />
                        <Route path="/users/create" element={<CreateUser />} />
                        <Route path="/users/update/:id" element={<UpdateUser />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
