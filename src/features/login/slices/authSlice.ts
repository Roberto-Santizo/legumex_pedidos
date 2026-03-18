import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/features/login/domain/schemas/schemas";

interface AuthState {
    isSignedIn: boolean;
    user?: User;
}

const initialState: AuthState = {
    isSignedIn: false,
    user: undefined
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.isSignedIn = false;
            state.user = undefined;
            localStorage.removeItem('AUTH_TOKEN');
            localStorage.removeItem('REFRESH_TOKEN');
        },

        login: (state, actions: PayloadAction<User>) => {
            state.user = actions.payload;
            state.isSignedIn = true;
            localStorage.setItem('AUTH_TOKEN', actions.payload.token);
            localStorage.setItem('REFRESH_TOKEN', actions.payload.refreshToken);
        }
    }
});

export const { logout, login } = authSlice.actions;
export default authSlice.reducer;