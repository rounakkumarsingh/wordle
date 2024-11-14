// src/features/auth/authAPI.ts
import type { User } from "@/types/user.types";
import api from "@/services/api";

interface LoginInput {
    password: string;
    username?: string;
    email?: string;
}

interface RegisterInput {
    username: string;
    email: string;
    password: string;
    fullName: string;
    profilePicture?: File;
}

interface AuthResponse {
    loggedInUser: User;
}

export const authAPI = {
    login: async (credentials: LoginInput) => {
        const response = await api.post<ApiResponse<AuthResponse>>(
            "/users/login",
            credentials
        );
        return response.data;
    },

    register: async (data: RegisterInput) => {
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("username", data.username);
        formData.append("password", data.password);
        formData.append("fullName", data.fullName);

        if (data.profilePicture) {
            formData.append("profilePicture", data.profilePicture);
        }

        const response = await api.post<ApiResponse<User>>(
            "/users/register",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    },

    logout: async () => {
        await api.post<ApiResponse<null>>("/users/logout");
    },

    getCurrentUser: async () => {
        const response = await api.get<ApiResponse<User>>(
            "/users/current-user"
        );
        return response.data;
    },

    refreshTokens: async () => {
        const response = await api.post<ApiResponse<null>>(
            "/users/refresh-token"
        );
        return response.data;
    },
};

export const handleApiError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || "An error occurred";
    }
    return "An unexpected error occurred";
};
