import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import { loginUser } from "@/features/auth/authSlice";
import { toast } from "react-hot-toast";

function Login() {
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(loginUser(credentials)).unwrap();
            navigate("/game");
        } catch (error) {
            toast.error("Login failed");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Username/Email
                    </label>
                    <input
                        type="text"
                        value={credentials.username}
                        onChange={(e) =>
                            setCredentials((prev) => ({
                                ...prev,
                                username: e.target.value,
                            }))
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        value={credentials.password}
                        onChange={(e) =>
                            setCredentials((prev) => ({
                                ...prev,
                                password: e.target.value,
                            }))
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
