import { configureStore, combineReducers } from "@reduxjs/toolkit";
import type { PreloadedState } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authReducer } from "@/features/auth/authSlice";

// Create root reducer with slices
const rootReducer = combineReducers({
    auth: authReducer,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
    return configureStore({
        reducer: rootReducer,
        preloadedState,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    // Ignore these action types
                    ignoredActions: ["persist/PERSIST", "auth/register"],
                    ignoredPaths: [
                        "payload.timestamp",
                        "auth.registerData.profilePicture",
                    ],
                },
            }),
        devTools: process.env.NODE_ENV !== "production",
    });
};

export const store = setupStore();
setupListeners(store.dispatch);

// Infer types from store
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
