import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/config/config";

export function PublicLayout() {
  const isSignedIn = useSelector((state: RootState) => state.auth.isSignedIn);

  if (isSignedIn) {
    return <Navigate to={'/home'} replace />
  }

  return (
    <main className="print:p-0 print:text-black h-screen bg-[linear-gradient(to_bottom,rgba(0,0,0,0.6),rgba(0,0,0,0.4)),url('./src/assets/imgs/public_background.jpg')] bg-cover bg-center">
      <Outlet />
    </main>
  );
}
