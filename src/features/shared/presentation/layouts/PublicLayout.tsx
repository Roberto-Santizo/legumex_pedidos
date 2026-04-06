import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/config/config";

export function PublicLayout() {
  const isSignedIn = useSelector((state: RootState) => state.auth.isSignedIn);

  if (isSignedIn) {
    return <Navigate to={'/home'} replace />
  }

  return (
    <main className="print:p-0 print:text-black h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Outlet />
    </main>
  );
}
