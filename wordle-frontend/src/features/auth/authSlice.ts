// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "./authAPI";
import type { User } from "@/types/user.types";
import api from "@/services/api";

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isLoading: false,
    error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ username, password }: { username: string; password: string }) => {
        const response = await api.post("/users/login", {
            username,
            password,
        });
        const token = response.data.token;
        localStorage.setItem("token", token);

        // Retrieve game IDs from localStorage
        const gameIds = JSON.parse(localStorage.getItem("gameIds") || "[]");

        if (gameIds.length > 0) {
            // Send game IDs to the backend
            await api.post(
                "/api/v1/games/addGame",
                { newGames: gameIds },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Clear game IDs from localStorage
            localStorage.removeItem("gameIds");
        }

        return response.data.user;
    }
);

export const registerUser = createAsyncThunk(
    "auth/register",
    async (
        data: Parameters<typeof authAPI.register>[0],
        { rejectWithValue }
    ) => {
        try {
            const response = await authAPI.register(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await authAPI.logout();
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const refreshTokenThunk = createAsyncThunk(
    "auth/refreshToken",
    async (_, { rejectWithValue }) => {
        try {
            await authAPI.refreshTokens();
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = null;
        },
        manualLogout: (state) => {
            state.user = null;
            state.error = null;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Register
            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
            })
            // Refresh token
            .addCase(refreshTokenThunk.fulfilled, (state) => {
                state.error = null;
            })
            .addCase(refreshTokenThunk.rejected, (state) => {
                state.user = null;
                state.error = "Session expired";
            });
    },
});

export const { clearErrors, manualLogout } = authSlice.actions;
export const authReducer = authSlice.reducer;
