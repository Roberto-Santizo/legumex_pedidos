import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/config/config";

export function PublicLayout() {
  const isSignedIn = useSelector((state: RootState) => state.auth.isSignedIn);

  if (isSignedIn) {
    return <Navigate to={'/home'} replace />
  }

  return (
    <main className="print:p-0 print:text-black min-h-screen bg-canvas">
      <Outlet />
    </main>
  );
}
