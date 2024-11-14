// src/pages/Home.tsx
import { Link } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";

function Home() {
    const user = useAppSelector((state) => state.auth.user);

    return (
        <div className="max-w-2xl mx-auto py-16 px-4">
            <h1 className="text-4xl font-bold text-center mb-8">Wordle</h1>
            <div className="space-y-4">
                {user ? (
                    <Link
                        to="/game"
                        className="block w-full p-4 text-center bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        Play Game
                    </Link>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="block w-full p-4 text-center bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="block w-full p-4 text-center bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                            Sign Up
                        </Link>
                    </>
                )}
                <Link
                    to="/leaderboard"
                    className="block w-full p-4 text-center bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                    Leaderboard
                </Link>
            </div>
        </div>
    );
}

export default Home;
