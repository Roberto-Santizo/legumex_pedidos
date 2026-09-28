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
        <main className="h-screen grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] overflow-hidden bg-canvas">
            <aside className="row-span-2 w-60 bg-white border-r border-neutral-200/80">
                <CustomSideBar className="h-full flex flex-col" />
            </aside>

            <header className="bg-white/80 backdrop-blur border-b border-neutral-200/80 px-8 h-16 flex items-center sticky top-0 z-10">
                <CustomHeader />
            </header>

            <section className="overflow-y-auto thin_scroll">
                <div className="px-8 py-7 max-w-[1600px] mx-auto">
                    <Outlet />
                </div>
            </section>
        </main>
    );
}
