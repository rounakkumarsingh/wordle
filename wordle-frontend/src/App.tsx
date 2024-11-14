// src/App.tsx
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { MainLayout } from "./layouts/MainLayout";
import "./index.css";
import "./App.css";

const Home = lazy(() => import("./pages/Home"));
const GamePage = lazy(() => import("./pages/Game"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));

export default function App() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/game" element={<GamePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                </Route>
            </Routes>
            <Toaster />
        </Suspense>
    );
}
