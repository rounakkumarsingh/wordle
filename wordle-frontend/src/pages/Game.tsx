import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const Home = lazy(() => import("@/pages/Home"));
const Game = lazy(() => import("@/pages/Game"));

export function App() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/game"
                    element={
                        <ProtectedRoute>
                            <Game />
                        </ProtectedRoute>
                    }
                />
            </Routes>
            <Toaster />
        </Suspense>
    );
}
