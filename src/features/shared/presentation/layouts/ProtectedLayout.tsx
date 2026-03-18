import { Navigate, Outlet } from "react-router-dom";
import { CustomHeader, CustomSideBar } from "@/features/shared/shared";
import { useSelector } from "react-redux";
import type { RootState } from "@/config/config";

export function ProtectedLayout() {
    const isSignedIn = useSelector((state: RootState) => state.auth.isSignedIn);

    if (!isSignedIn) {
        return <Navigate to={'/login'} replace />
    }

    return (
        <main className="h-screen grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] overflow-hidden">
            <aside className="row-span-2 bg-gray-900 text-white">
                <CustomSideBar className="py-10 px-5 space-y-4 h-full overflow-y-auto" />
            </aside>

            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <CustomHeader />
            </header>

            <section className="bg-gray-50 p-6 overflow-y-auto">
                <Outlet />
            </section>
        </main>
    );
}