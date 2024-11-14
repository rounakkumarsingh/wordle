import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"; // Correct the import path

const Home = lazy(() => import("./Home"));
const GameComponent = lazy(() => import("@/components/game/Game"));

export default function Game() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/game"
                    element={
                        <ProtectedRoute>
                            <GameComponent />
                        </ProtectedRoute>
                    }
                />
            </Routes>
            <Toaster />
        </Suspense>
    );
}
