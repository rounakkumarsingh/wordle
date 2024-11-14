import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logoutUser } from "@/features/auth/authSlice";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export function Navbar() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <nav className="bg-white shadow fixed top-0 left-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <span className="text-2xl font-bold text-green-600">
                                Wordle
                            </span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                            {user && (
                                <Link
                                    to="/game"
                                    className="text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Play Game
                                </Link>
                            )}
                            <Link
                                to="/leaderboard"
                                className="text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Leaderboard
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center">
                        {user ? (
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-md">
                                    <img
                                        src={user.profilePicture}
                                        alt={user.username}
                                        className="h-8 w-8 rounded-full"
                                    />
                                    <span className="text-sm font-medium">
                                        {user.username}
                                    </span>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content className="bg-white rounded-md shadow-lg p-1 mt-1">
                                    <DropdownMenu.Item className="px-4 py-2 hover:bg-gray-100 rounded cursor-pointer">
                                        <Link to="/profile">Profile</Link>
                                    </DropdownMenu.Item>
                                    <DropdownMenu.Item
                                        className="px-4 py-2 hover:bg-gray-100 rounded text-red-600 cursor-pointer"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
                        ) : (
                            <div className="flex gap-2">
                                <Link
                                    to="/login"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-600"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
