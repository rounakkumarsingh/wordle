// src/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/common/Navbar";

export function MainLayout() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto py-6 px-4 pt-20">
                <Outlet />
            </main>
        </div>
    );
}
