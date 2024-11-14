// src/components/auth/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const user = useAppSelector((state) => state.auth.user);
    const location = useLocation();

    if (!user) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return <>{children}</>;
}
